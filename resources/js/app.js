import Alpine from 'alpinejs';
import collapse from '@alpinejs/collapse';

import chatWidget from './components/chat-widget';
import trackFinder from './components/track-finder';
import copyToClipboard from './components/copy-to-clipboard';
import stickyHeader from './components/sticky-header';

Alpine.plugin(collapse);

Alpine.data('chatWidget', chatWidget);
Alpine.data('trackFinder', trackFinder);
Alpine.data('copyToClipboard', copyToClipboard);
Alpine.data('stickyHeader', stickyHeader);

window.Alpine = Alpine;
Alpine.start();
