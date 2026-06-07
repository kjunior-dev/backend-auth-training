export async function getDashboard(req, res) {
    return res.json({
        message: "Bem-vindo ao dashboard protegido.",
        user: req.user,
        stats: {
            totalUsers: 1,
            totalOrders: 0,
            notifications: 3,
        },
    });
}
//# sourceMappingURL=dashboard.controller.js.map