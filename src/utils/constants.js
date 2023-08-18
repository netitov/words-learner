
import { VscAccount } from 'react-icons/vsc';
import { MdTranslate } from 'react-icons/md';
import { TfiStatsUp } from 'react-icons/tfi';
import { GiFilmStrip } from 'react-icons/gi';
import { MdOutlineQuiz } from 'react-icons/md';
import { BsBookmarks } from 'react-icons/bs';
import { RxDashboard } from 'react-icons/rx';

export const charsLimit = '100';

export const tooltipOption = {
  background: '#000000bf',
  fontSize: '0.8em',
  fontFamily: 'Noto Sans Display',
  fontWeight: 300,
  lineHeight: 1.3,
  padding: '5px',
  WebkitBackdropFilter: 'blur(4px)',
  backdropFilter: 'blur(4px)'
};

export const defaultLang = {
  lang: 'Spanish',
  code: 'es'
};

export const filterBtns = [
  'common verbs', 'common nouns', 'in every movie', 'average frequency', 'low frequency'
];

export const defaultFilters = {
  lang: 'Spanish',
  code: 'es'
};

export const accountNav = [
  {
    route: '/account/navigation',
    title: 'My account',
    icon: <RxDashboard />
  },
  {
    route: '/account/translator',
    title: 'Translator',
    icon: <MdTranslate />
  },
  {
    route: '/account/frequency',
    title: 'Usage data',
    icon: <GiFilmStrip />
  },
  {
    route: '/account/words',
    title: 'Word list',
    icon: <BsBookmarks />
  },
  {
    route: '/account/quiz',
    title: 'Tests',
    icon: <MdOutlineQuiz />
  },
  {
    route: '/account/progress',
    title: 'Progress',
    icon: <TfiStatsUp />
  },
  {
    route: '/account/info',
    title: 'Account info',
    icon: <VscAccount />
  },
];



export function getStyle(obj) {

  const { frontColor, backColor } = obj;

  const patterns = [
    {
      pattern:'rhombus',
      style: {
        backgroundColor: backColor,
        backgroundImage:  `linear-gradient(135deg, ${frontColor} 25%, transparent 25%), linear-gradient(225deg, ${frontColor} 25%, transparent 25%), linear-gradient(45deg, ${frontColor} 25%, transparent 25%), linear-gradient(315deg, ${frontColor} 25%, ${backColor} 25%)`,
        backgroundPosition: '32px 0, 32px 0, 0 0, 0 0',
        backgroundSize: '16px 16px'
      }

    },
    {
      pattern:'zigzag',
      style: {
        backgroundColor: backColor,
        backgroundImage:  `linear-gradient(135deg, ${frontColor} 25%, transparent 25%), linear-gradient(225deg, ${frontColor} 25%, transparent 25%), linear-gradient(45deg, ${frontColor} 25%, transparent 25%), linear-gradient(315deg, ${frontColor} 25%, ${backColor} 25%)`,
        backgroundPosition:  '24px 0, 24px 0, 0 0, 0 0',
        backgroundSize: '48px 48px'
      }
    },
    {
      pattern:'paper',
      style: {
        backgroundColor: backColor,
        backgroundImage:  `linear-gradient(${frontColor} 2.6px, transparent 2.6px), linear-gradient(90deg, ${frontColor} 2.6px, transparent 2.6px), linear-gradient(${frontColor} 1.3px, transparent 1.3px), linear-gradient(90deg, ${frontColor} 1.3px, ${backColor} 1.3px)`,
        backgroundPosition:  '-2.6px -2.6px, -2.6px -2.6px, -1.3px -1.3px, -1.3px -1.3px',
        backgroundSize: '65px 65px, 65px 65px, 13px 13px, 13px 13px'
      }
    },
    {
      pattern:'isometric',
      style: {
        backgroundColor: backColor,
        backgroundImage:  `linear-gradient(30deg, ${frontColor} 12%, transparent 12.5%, transparent 87%, ${frontColor} 87.5%, ${frontColor}), linear-gradient(150deg, ${frontColor} 12%, transparent 12.5%, transparent 87%, ${frontColor} 87.5%, ${frontColor}), linear-gradient(30deg, ${frontColor} 12%, transparent 12.5%, transparent 87%, ${frontColor} 87.5%, ${frontColor}), linear-gradient(150deg, ${frontColor} 12%, transparent 12.5%, transparent 87%, ${frontColor} 87.5%, ${frontColor}), linear-gradient(60deg, ${frontColor}77 25%, transparent 25.5%, transparent 75%, ${frontColor}77 75%, ${frontColor}77), linear-gradient(60deg, ${frontColor}77 25%, transparent 25.5%, transparent 75%, ${frontColor}77 75%, ${frontColor}77)`,
        backgroundPosition:  '0 0, 0 0, 30px 53px, 30px 53px, 0 0, 30px 53px',
        backgroundSize: '60px 105px'
      }
    },
    {
      pattern:'lines',
      style: {
        backgroundColor: backColor,
        backgroundImage:  `linear-gradient(0deg, ${backColor} 50%, ${frontColor} 50%)`,
        backgroundSize: '37px 37px'
      }
    },
    {
      pattern:'lines2',
      style: {
        backgroundColor: backColor,
        backgroundImage:  `linear-gradient(to right, ${frontColor}, ${frontColor} 18.5px, ${backColor} 18.5px, ${backColor} )`,
        backgroundSize: '37px 37px'
      }
    },
    {
      pattern:'polka',
      style: {
        backgroundColor: backColor,
        backgroundImage:  `radial-gradient(${frontColor} 2px, ${backColor} 2px)`,
        backgroundSize: '16px 16px'
      }
    },
    {
      pattern:'polka2',
      style: {
        backgroundColor: backColor,
        backgroundImage:  `radial-gradient(${frontColor} 1.45px, transparent 1.45px), radial-gradient(${frontColor} 1.45px, ${backColor} 1.45px)`,
        backgroundSize: '16px 16px'
      }
    },
    {
      pattern:'diagonal3',
      style: {
        backgroundColor: backColor,
        backgroundImage:  `repeating-linear-gradient(45deg, ${frontColor} 0, ${frontColor} 2.6px, ${backColor} 0, ${backColor} 50%)`,
        backgroundSize: '26px 26px'
      }
    },
    {
      pattern:'line3',
      style: {
        backgroundColor: backColor,
        backgroundImage:  `repeating-linear-gradient(0deg, ${frontColor}, ${frontColor} 2.6px, ${backColor} 2.6px, ${backColor})`,
        backgroundSize: '52px 52px'
      }
    },
    {
      pattern:'line4',
      style: {
        backgroundColor: backColor,
        backgroundImage:  `repeating-linear-gradient(to right, ${frontColor}, ${frontColor} 2.6px, ${backColor} 2.6px, ${backColor})`,
        backgroundSize: '52px 252px'
      }
    }
  ];
  return patterns;
}
