import { shell } from '../lib/layout.mjs';
import { icon, label } from '../lib/html.mjs';
import { monicaWelcome, trustStrip, closing, plainHero } from '../lib/sections.mjs';
import { services } from '../data/services.js';

const rooms = `<section class="section rooms" data-world="house" data-tone="light"><div class="wrap">${label('Find your way around MKM')}<ol class="rooms__list" data-stagger>${services.map(s => `<li data-reveal><a class="room room--${s.theme}" href="${s.path}"><span class="room__num">${s.number}</span><div class="room__body"><h2 class="room__name">${s.short}</h2><p class="room__line">${s.description}</p></div><span class="room__go">Explore ${s.short} ${icon.arrow}</span></a></li>`).join('')}</ol></div></section>`;

export function about() {
  return shell({
    title: 'About MKM Services — Care, Beauty & Tax',
    description: 'MKM Services brings together Care, Beauty and Tax Return Services. Each begins with the same simple idea: a personal conversation with Monica.',
    path: '/about/', world: 'house', tone: 'light', crumbs: [['MKM Services', '/'], ['About', '/about/']],
    content: `${plainHero({ kicker: 'Meet MKM Services', title: 'Different ways to make your day <em>a little better.</em>', lede: 'MKM brings together three service areas: Care, Beauty and Tax Return Services. Each begins with the same simple idea, a personal conversation about what you need.', world: 'house' })}${monicaWelcome()}${rooms}${trustStrip()}${closing({ title: 'Ready when <em>you are.</em>' })}`,
  });
}
