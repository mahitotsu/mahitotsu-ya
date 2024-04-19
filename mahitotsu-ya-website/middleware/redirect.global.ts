export default defineNuxtRouteMiddleware((to) => {
    switch (to.path) {
        case '/about':
            return navigateTo([to.path, '/greeting'].join(''));
        case '/help':
            return navigateTo([to.path, '/contact'].join(''));
        default:
            return undefined;
    }
});