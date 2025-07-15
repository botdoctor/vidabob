import { Request, Response } from 'express';
import Booking from '../models/Booking';
import Vehicle from '../models/VehicleNew';
import User from '../models/User';
import Contact from '../models/Contact';
import Sale from '../models/Sale';

export const getAdminDashboardStats = async (req: any, res: Response): Promise<void> => {
  try {
    // Only admin can view stats
    if (req.user.role !== 'admin') {
      res.status(403).json({
        error: 'Access denied',
        message: 'Only admins can view dashboard statistics',
      });
      return;
    }

    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // Get vehicle stats
    const totalVehicles = await Vehicle.countDocuments();
    const vehiclesAddedThisMonth = await Vehicle.countDocuments({
      createdAt: { $gte: thisMonthStart }
    });
    const vehiclesAddedLastMonth = await Vehicle.countDocuments({
      createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd }
    });
    const vehicleGrowth = vehiclesAddedLastMonth > 0 
      ? ((vehiclesAddedThisMonth - vehiclesAddedLastMonth) / vehiclesAddedLastMonth * 100).toFixed(1)
      : '100';

    // Get customer stats
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const customersAddedThisMonth = await User.countDocuments({
      role: 'customer',
      createdAt: { $gte: thisMonthStart }
    });
    const customersAddedLastMonth = await User.countDocuments({
      role: 'customer',
      createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd }
    });
    const customerGrowth = customersAddedLastMonth > 0
      ? ((customersAddedThisMonth - customersAddedLastMonth) / customersAddedLastMonth * 100).toFixed(1)
      : '100';

    // Get booking stats
    const activeBookings = await Booking.countDocuments({
      status: { $in: ['pending', 'confirmed'] }
    });
    const bookingsThisMonth = await Booking.countDocuments({
      createdAt: { $gte: thisMonthStart }
    });
    const bookingsLastMonth = await Booking.countDocuments({
      createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd }
    });
    const bookingGrowth = bookingsLastMonth > 0
      ? ((bookingsThisMonth - bookingsLastMonth) / bookingsLastMonth * 100).toFixed(1)
      : '100';

    // Get vehicles sold stats
    const vehiclesSoldThisMonth = await Sale.countDocuments({
      soldDate: { $gte: thisMonthStart }
    });
    const vehiclesSoldLastMonth = await Sale.countDocuments({
      soldDate: { $gte: lastMonthStart, $lte: lastMonthEnd }
    });
    const vehiclesSoldTotal = await Sale.countDocuments();
    const vehiclesSoldGrowth = vehiclesSoldLastMonth > 0
      ? ((vehiclesSoldThisMonth - vehiclesSoldLastMonth) / vehiclesSoldLastMonth * 100).toFixed(1)
      : '100';

    // Get revenue stats from bookings (rentals)
    const rentalRevenueThisMonth = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: thisMonthStart },
          status: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalCost' }
        }
      }
    ]);
    
    const rentalRevenueLastMonth = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
          status: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalCost' }
        }
      }
    ]);

    const totalRentalRevenue = await Booking.aggregate([
      {
        $match: {
          status: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalCost' }
        }
      }
    ]);

    // Get revenue stats from sales
    const salesRevenueThisMonth = await Sale.aggregate([
      {
        $match: {
          soldDate: { $gte: thisMonthStart }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$salePrice' }
        }
      }
    ]);
    
    const salesRevenueLastMonth = await Sale.aggregate([
      {
        $match: {
          soldDate: { $gte: lastMonthStart, $lte: lastMonthEnd }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$salePrice' }
        }
      }
    ]);

    const totalSalesRevenue = await Sale.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$salePrice' }
        }
      }
    ]);

    // Combine rental and sales revenue
    const currentMonthRentalRevenue = rentalRevenueThisMonth[0]?.total || 0;
    const currentMonthSalesRevenue = salesRevenueThisMonth[0]?.total || 0;
    const currentMonthRevenue = currentMonthRentalRevenue + currentMonthSalesRevenue;
    
    const lastMonthRentalRevenue = rentalRevenueLastMonth[0]?.total || 0;
    const lastMonthSalesRevenue = salesRevenueLastMonth[0]?.total || 0;
    const lastMonthRevenue = lastMonthRentalRevenue + lastMonthSalesRevenue;
    
    const totalRevenue = (totalRentalRevenue[0]?.total || 0) + (totalSalesRevenue[0]?.total || 0);
    
    const revenueGrowth = lastMonthRevenue > 0
      ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1)
      : '100';

    // Get recent bookings
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('vehicleId', 'make vehicleModel year')
      .populate('userId', 'firstName lastName email');

    // Get vehicle type distribution
    const vehicleStats = await Vehicle.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    const vehiclesByType = vehicleStats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {} as any);

    // Get reseller stats
    const totalResellers = await User.countDocuments({ role: 'reseller' });
    const activeResellers = await User.countDocuments({ role: 'reseller', isActive: true });
    
    // Get resellers with their commission earnings
    const topResellers = await User.aggregate([
      {
        $match: { role: 'reseller' }
      },
      {
        $sort: { totalCommissions: -1 }
      },
      {
        $limit: 5
      }
    ]);

    // Get reseller-generated bookings this month
    const resellerBookingsThisMonth = await Booking.aggregate([
      {
        $match: {
          resellerId: { $exists: true, $ne: null },
          createdAt: { $gte: thisMonthStart }
        }
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          revenue: { $sum: '$totalCost' }
        }
      }
    ]);

    // Get total commissions paid
    const totalCommissionsPaid = await User.aggregate([
      {
        $match: { role: 'reseller' }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalCommissions' }
        }
      }
    ]);

    res.json({
      stats: {
        totalVehicles: {
          value: totalVehicles,
          change: vehicleGrowth
        },
        totalCustomers: {
          value: totalCustomers,
          change: customerGrowth
        },
        activeBookings: {
          value: activeBookings,
          change: bookingGrowth
        },
        totalRevenue: {
          value: totalRevenue,
          change: revenueGrowth
        },
        vehiclesSold: {
          value: vehiclesSoldTotal,
          change: vehiclesSoldGrowth,
          thisMonth: vehiclesSoldThisMonth
        }
      },
      recentBookings: recentBookings.map(booking => ({
        id: booking._id,
        vehicle: booking.vehicleId ? `${(booking.vehicleId as any).make} ${(booking.vehicleId as any).vehicleModel}` : 'Unknown Vehicle',
        customer: booking.userId ? `${(booking.userId as any).firstName} ${(booking.userId as any).lastName}` : 'Unknown Customer',
        startDate: booking.pickupDate,
        endDate: booking.returnDate,
        totalCost: booking.totalCost,
        status: booking.status,
        createdAt: booking.createdAt
      })),
      vehicleStats: {
        rental: vehiclesByType.rental || 0,
        sale: vehiclesByType.sale || 0,
        both: vehiclesByType.both || 0,
        total: totalVehicles
      },
      resellerStats: {
        totalResellers,
        activeResellers,
        totalCommissionsPaid: totalCommissionsPaid[0]?.total || 0,
        resellerBookingsThisMonth: {
          count: resellerBookingsThisMonth[0]?.count || 0,
          revenue: resellerBookingsThisMonth[0]?.revenue || 0
        },
        topResellers: topResellers.map(reseller => ({
          id: reseller._id,
          name: `${reseller.firstName} ${reseller.lastName}`,
          username: reseller.username,
          totalCommissions: reseller.totalCommissions,
          commissionRate: reseller.commissionRate
        }))
      }
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to fetch dashboard stats',
      message: error.message,
    });
  }
};

export const getAdminAnalyticsData = async (req: any, res: Response): Promise<void> => {
  try {
    // Only admin can view stats
    if (req.user.role !== 'admin') {
      res.status(403).json({
        error: 'Access denied',
        message: 'Only admins can view analytics data',
      });
      return;
    }

    const { timeRange = '30d' } = req.query;
    
    // Calculate date range
    let startDate = new Date();
    switch (timeRange) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }

    // Get monthly rental data
    const rentalsByMonth = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$totalCost' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Get monthly sales data
    const salesByMonth = await Sale.aggregate([
      {
        $match: {
          soldDate: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$soldDate' },
            month: { $month: '$soldDate' }
          },
          revenue: { $sum: '$salePrice' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Combine monthly data
    const monthlyDataMap = new Map();
    
    // Add rental data
    rentalsByMonth.forEach(item => {
      const key = `${item._id.year}-${item._id.month}`;
      monthlyDataMap.set(key, {
        year: item._id.year,
        month: item._id.month,
        rentalRevenue: item.revenue,
        rentalCount: item.count,
        salesRevenue: 0,
        salesCount: 0
      });
    });
    
    // Add sales data
    salesByMonth.forEach(item => {
      const key = `${item._id.year}-${item._id.month}`;
      if (monthlyDataMap.has(key)) {
        const existing = monthlyDataMap.get(key);
        existing.salesRevenue = item.revenue;
        existing.salesCount = item.count;
      } else {
        monthlyDataMap.set(key, {
          year: item._id.year,
          month: item._id.month,
          rentalRevenue: 0,
          rentalCount: 0,
          salesRevenue: item.revenue,
          salesCount: item.count
        });
      }
    });

    // Convert to sorted array
    const combinedMonthlySales = Array.from(monthlyDataMap.values())
      .sort((a, b) => a.year - b.year || a.month - b.month)
      .map(item => ({
        _id: { year: item.year, month: item.month },
        revenue: item.rentalRevenue + item.salesRevenue,
        count: item.rentalCount + item.salesCount,
        rentalRevenue: item.rentalRevenue,
        salesRevenue: item.salesRevenue
      }));

    // Get vehicle category stats
    const vehicleCategories = await Vehicle.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get revenue by category
    const revenueByCategory = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $ne: 'cancelled' }
        }
      },
      {
        $lookup: {
          from: 'vehicles',
          localField: 'vehicleId',
          foreignField: '_id',
          as: 'vehicle'
        }
      },
      {
        $unwind: '$vehicle'
      },
      {
        $group: {
          _id: '$vehicle.category',
          revenue: { $sum: '$totalCost' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Get top performing vehicles
    const topVehicles = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: '$vehicleId',
          revenue: { $sum: '$totalCost' },
          bookings: { $sum: 1 }
        }
      },
      {
        $sort: { revenue: -1 }
      },
      {
        $limit: 5
      },
      {
        $lookup: {
          from: 'vehicles',
          localField: '_id',
          foreignField: '_id',
          as: 'vehicle'
        }
      },
      {
        $unwind: '$vehicle'
      }
    ]);

    // Get customer metrics
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const newCustomersThisMonth = await User.countDocuments({
      role: 'customer',
      createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
    });
    
    const repeatCustomers = await Booking.aggregate([
      {
        $group: {
          _id: '$userId',
          bookingCount: { $sum: 1 }
        }
      },
      {
        $match: {
          bookingCount: { $gt: 1 }
        }
      },
      {
        $count: 'repeatCustomers'
      }
    ]);

    // Calculate totals
    const totalRentalRevenue = await Booking.aggregate([
      {
        $match: {
          status: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalCost' }
        }
      }
    ]);

    const totalVehicleSalesRevenue = await Sale.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$salePrice' }
        }
      }
    ]);

    const totalRevenue = (totalRentalRevenue[0]?.total || 0) + (totalVehicleSalesRevenue[0]?.total || 0);
    const totalBookings = await Booking.countDocuments({ status: { $ne: 'cancelled' } });
    const totalSales = await Sale.countDocuments();

    // Get recent activity
    const recentActivity = await Promise.all([
      // Recent sales
      Booking.find({ status: 'completed' })
        .sort({ createdAt: -1 })
        .limit(3)
        .populate('vehicleId', 'make vehicleModel year')
        .populate('userId', 'firstName lastName'),
      
      // Recent bookings
      Booking.find({ status: { $in: ['pending', 'confirmed'] } })
        .sort({ createdAt: -1 })
        .limit(3)
        .populate('vehicleId', 'make vehicleModel year')
        .populate('userId', 'firstName lastName'),
      
      // Recent customers
      User.find({ role: 'customer' })
        .sort({ createdAt: -1 })
        .limit(3)
    ]);

    res.json({
      salesData: {
        totalRevenue,
        totalBookings,
        totalSales,
        monthlySales: combinedMonthlySales.map(item => ({
          month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
          revenue: item.revenue,
          bookings: item.count,
          rentalRevenue: item.rentalRevenue,
          salesRevenue: item.salesRevenue
        }))
      },
      vehicleCategories: vehicleCategories.map(cat => {
        const revenue = revenueByCategory.find(r => r._id === cat._id);
        return {
          category: cat._id,
          count: cat.count,
          revenue: revenue?.revenue || 0,
          bookings: revenue?.count || 0
        };
      }),
      topPerformingVehicles: topVehicles.map(item => ({
        make: item.vehicle.make,
        model: item.vehicle.vehicleModel,
        year: item.vehicle.year,
        revenue: item.revenue,
        bookings: item.bookings,
        type: item.vehicle.type
      })),
      customerMetrics: {
        totalCustomers,
        newCustomersThisMonth,
        repeatCustomers: repeatCustomers[0]?.repeatCustomers || 0
      },
      recentActivity: {
        sales: recentActivity[0].map(booking => ({
          id: booking._id,
          type: 'sale',
          description: `${(booking.vehicleId as any)?.make} ${(booking.vehicleId as any)?.vehicleModel} sold to ${(booking.userId as any)?.firstName} ${(booking.userId as any)?.lastName}`,
          amount: booking.totalCost,
          time: booking.createdAt
        })),
        bookings: recentActivity[1].map(booking => ({
          id: booking._id,
          type: 'booking',
          description: `${(booking.vehicleId as any)?.make} ${(booking.vehicleId as any)?.vehicleModel} booked by ${(booking.userId as any)?.firstName} ${(booking.userId as any)?.lastName}`,
          amount: booking.totalCost,
          time: booking.createdAt
        })),
        customers: recentActivity[2].map(customer => ({
          id: customer._id,
          type: 'customer',
          description: `${customer.firstName} ${customer.lastName} registered`,
          time: customer.createdAt
        }))
      }
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to fetch analytics data',
      message: error.message,
    });
  }
};