export default defineNuxtRouteMiddleware((to) => {
    switch (to.path) {
        case '/about':
            return navigateTo([to.path, '/greeting'].join(''));
        default:
            return undefined;
    }
});