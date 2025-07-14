// src/ui/visuals/imageAssets.ts

// 1. Import each image file directly.
//    Vite will replace these with the correct public path during the build.
import startImg from '/assets/images/Start.png';
import forestImg from '/assets/images/Forest.png';
import shackImg from '/assets/images/Deserted Shack.png';
import riverImg from '/assets/images/River.png';
import mountainImg from '/assets/images/Mountain.png';
import placeholderImg from '/assets/images/Placeholder.png';

// 2. Create a mapping from the environment name to the imported image variable.
export const environmentImageAssets: { [key: string]: string } = {
    'Start': startImg,
    'Forest': forestImg,
    'Deserted Shack': shackImg,
    'River': riverImg,
    'Mountain': mountainImg,
    'Placeholder': placeholderImg
    // Add 'Cave' here when you have the image
};
