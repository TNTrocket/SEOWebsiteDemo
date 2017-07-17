/**
 * Created by Administrator on 2017/7/14.
 */
import { locationStorage } from './global'
export function removeSelect() {
    locationStorage().removeLocationStorage('select');
}