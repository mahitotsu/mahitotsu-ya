export default defineNuxtRouteMiddleware((to) => {
    switch (to.path) {
        case '/about':
            return navigateTo([to.path, '/greeting'].join(''));
        case '/help':
            return navigateTo([to.path, '/contact'].join(''));
        case '/order':
            return navigateTo([to.path, '/cart'].join(''));
        default:
            return undefined;
    }
});