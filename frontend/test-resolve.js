import { createRequire } from 'module';
const require = createRequire(import.meta.url);

try {
  console.log('Resolving swiper/react...');
  console.log(require.resolve('swiper/react'));
} catch (e) {
  console.error('Failed to resolve swiper/react:', e.message);
}

try {
  console.log('Resolving swiper/modules...');
  console.log(require.resolve('swiper/modules'));
} catch (e) {
  console.error('Failed to resolve swiper/modules:', e.message);
}

try {
  console.log('Resolving swiper/css...');
  console.log(require.resolve('swiper/css'));
} catch (e) {
  console.error('Failed to resolve swiper/css:', e.message);
}
