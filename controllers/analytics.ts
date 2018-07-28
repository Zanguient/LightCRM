import moment from "moment";
import Order from "../models/Orders";
import errorHandler from "../utils/errorHandler";

async function overview(req, res) {
    try {
        const allOrders = await Order.find({
            user: req.user.id
        }).sort({date: 1});

        const ordersMap = getOrdersMap(allOrders);

        const yesterdayOrders = ordersMap[moment().add(-1, 'd').format('YYYY.MM.DD')] || [];

        // Total number of orders
        const totalOrdersNumber = allOrders.length;

        // Total days
        const daysNumber = Object.keys(ordersMap).length;

        // Orders per day
        const ordersPerDay: number = +(totalOrdersNumber / daysNumber).toFixed(0);

        // Yesterday orders number
        const yesterdayOrdersNumber = yesterdayOrders.length;

        // Orders percent
        const ordersPercent = (((yesterdayOrdersNumber / ordersPerDay) - 1) * 100).toFixed(2);

        // Total revenues
        const totalRevenues = calculatePrice(allOrders);

        // Daily revenue
        const revenuePerDay = totalRevenues / daysNumber;

        // Yesterday revenue
        const yesterdayRevenue = calculatePrice(yesterdayOrders);

        // Revenue percent
        const revenuePercent = (((yesterdayOrdersNumber / revenuePerDay) - 1) * 100).toFixed(2);

        // Revenue comparison
        const revenueComparison = (yesterdayOrdersNumber - revenuePerDay).toFixed(2);

        // Orders number comparison
        const ordersNumberComparison = (yesterdayOrdersNumber - ordersPerDay).toFixed(2);

        res.status(200).json({
            revenue: {
                percent: Math.abs(+revenuePercent),
                compare: Math.abs(+revenueComparison),
                yesterday: +yesterdayRevenue,
                isHigher: +revenuePercent > 0
            },
            orders: {
                percent: Math.abs(+ordersPercent),
                compare: Math.abs(+ordersNumberComparison),
                yesterday: +yesterdayOrdersNumber,
                isHigher: +ordersPercent > 0
            }
        });

    } catch (e) {
        errorHandler(res, e);
    }
}

async function analytics(req, res) {
    try {
        const allOrders = await Order.find({user: req.user.id}).sort({date: 1});
        const ordersMap = getOrdersMap(allOrders);

        const average = +(calculatePrice(allOrders) / Object.keys(ordersMap).length).toFixed(2);

        const chart = Object.keys(ordersMap).map(label => {

            const revenue = calculatePrice(ordersMap[label]);
            const order = ordersMap[label].length;

            return  {
                label: label,
                revenue: revenue,
                order: order
            }
        });

        res.status(200).json({
            average: average,
            chart: chart

        });

    } catch (e) {
        errorHandler(res, e);
    }
}

function getOrdersMap(orders = []) {
    const daysOrders = {};
    orders.forEach(order => {
        const date = moment(order.date).format('YYYY.MM.DD');

        if (date === moment().format('YYYY.MM.DD')) { // exclude current day
            return;
        }

        if (!daysOrders[date]) {
            daysOrders[date] = [];
        }

        daysOrders[date].push(order);
    });

    return daysOrders;
}

function calculatePrice(orders = []) {
    return orders.reduce((total, order) => {
        const orderPrice = order.list.reduce((orderTotal, item) => {
            return orderTotal += item.cost * item.quantity;
        }, 0);
        return total += orderPrice;
    }, 0);
}

export default {overview, analytics};