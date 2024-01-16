import { Geolocation } from '@capacitor/geolocation';

addEventListener('updateGeolocationTask', async (resolve, reject, args) => {
    try {
        const store = useStore()
        const supabase = useSupabaseClient()
        const position = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });

        const { error: geolocationError } = await supabase.from('geolocations').upsert({
            profile_id: store.user.id,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        }, { onConflict: 'profile_id'})

        if (geolocationError) {
            reject(geolocationError.message);
            return
        }

        console.log('Background geolocation updated');
        resolve({ 'message': 'Background geolocation updated', coords: position.coords });
    } catch (error) {
        reject(error);
    }
});