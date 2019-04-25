export function promiseSleep(dur: number) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(true), dur);
    });
}