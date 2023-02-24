import { boot } from 'quasar/wrappers'
import numeral from 'numeral';
export default boot(({ app }) => {
    numeral.register('locale', 'es', {
        delimiters: {
            thousands: ' ',
            decimal: ','
        },
        abbreviations: {
            thousand: 'k',
            million: 'm',
            billion: 'b',
            trillion: 't'
        },
        ordinal: function (number) {
            return number === 1 ? 'er' : 'ème';
        },
        currency: {
            symbol: 'S /.'
        }
    });

    // switch between locales
    numeral.locale('es');
    const currencyFormatter = (numberToFormat) => {
        return numeral(numberToFormat).format('$ 0,0.00')
    }
    app.config.globalProperties.$currencyFormatter = currencyFormatter;
    //app.config.globalProperties.$images_path = 'http://localhost:8000/admin/menu/products/images/';
    // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
    //       so you can easily perform requests against your app's API 
})
