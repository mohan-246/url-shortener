export default function base10ToBase62(number) {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const base = characters.length;
    let result = '';

    do {
        result = characters[number % base] + result;
        number = Math.floor(number / base);
    } while (number > 0);

    return result;
}