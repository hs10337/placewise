import { setupIonicReact } from '@ionic/react'
import '@ionic/react/css/core.css'

// Use the iOS behavior of web components without Ionic's optional typography,
// normalization, layout, or color palettes. Placewise supplies its own theme.
setupIonicReact({ mode: 'ios' })
