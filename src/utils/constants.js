
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
    route: '/',
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
