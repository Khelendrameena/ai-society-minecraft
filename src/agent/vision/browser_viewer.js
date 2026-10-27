import settings from '../settings.js';
import prismarineViewer from 'prismarine-viewer';
const mineflayerViewer = prismarineViewer.mineflayer;

export function addBrowserViewer(bot, count_id) {
    // Only the FIRST bot gets a viewer. Running a WorldView per bot (5x)
    // is the main cause of viewer lag on a busy PC — one camera is enough
    // to watch the society; it serves on port 3000.
    if (settings.render_bot_view && count_id === 0)
        mineflayerViewer(bot, { port: 3000, firstPerson: true, viewDistance: 4 });
}
