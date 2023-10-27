import sveltePreprocess from 'svelte-preprocess';


import adapter from '@sveltejs/adapter-static';

export default {
  preprocess: sveltePreprocess(),
  kit: {


    adapter: adapter({

      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:8080',
      },
    }),
  }
};