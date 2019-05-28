<template>
  <main>
    <Title/>
    <ul id="downloads">
      <Download v-for="download in downloads.slice().reverse()" :key="download.id" :download="download"></Download>
    </ul>
    <Contact/>
  </main>
</template>

<script>
import Title from "@/components/Title";
import Contact from "@/components/Contact";
import Download from "@/components/Download";

import sanityClient from "~/sanityClient";
const query = `*[_type == "pdf"] {_id, title, "pdfUrl": pdf.asset->url}`;

export default {
  name: "index",
  components: {
    Title,
    Download,
    Contact
  },
  asyncData() {
    return sanityClient.fetch(query).then(res => {
      return { downloads: res.reverse() };
    });
  },
};
</script>

<style>
/*
/--------------------
/ Font
/--------------------
*/

@font-face {
  font-family: "GTA";
  src: url("~static/fonts/GT-America-Trial-Extended-Bold.otf");
}

/*
/--------------------
/ General (mobile first)
/--------------------
*/
html,
body,
#__nuxt,
#__layout,
#__layout > div {
  min-width: 100vw;
  min-height: 100vh;
}

#__layout > div {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

body {
  font-family: "GTA";
}

main {
  min-width: 400px;
  min-width: calc(100vw - 4rem);
  min-height: calc(100vh - 1rem);
  margin: 0.5rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

h1 {
  text-transform: uppercase;
  text-align: center;
  font-size: 2.5rem;
  transform: scaleY(0.85);
}

h2 {
  font-size: 7rem;
  transform: scaleY(0.85);
  line-height: 0.8;
  transition: color 0.5s ease-in-out;
}

h3 {
  text-transform: uppercase;
  font-size: 1.25rem;
  letter-spacing: 0.22rem;
  transform: scaleY(0.9);
  margin-bottom: 1.5rem;
}

a {
  text-decoration: none;
  color: black;
  text-align: center;
  transition: color 0.5s ease-in-out;
}

a:hover h2 {
  color: grey;
}

#downloads {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

#contact {
  width: 94%;
  margin: auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

#contact a:hover {
  color: grey;
}

/* iphone se and other tiny basterds */
@media (max-width: 374px) {
  h1 {
    font-size: 2rem;
  }
}

/* iphone 6 and other also tiny basterds */
@media (min-width: 414px) {
  h1 {
    font-size: 3rem;
  }
}

/*
/--------------------
/ Tablet and above
/--------------------
*/

/* ipad min and higher */
@media (min-width: 768px) {
  main {
    min-width: 750px;
    max-width: 750px;
    margin: auto;
  }
  h1 {
    font-size: calc(3rem * 2);
    margin-top: 1rem;
  }
  #downloads {
    margin: auto;
    flex-direction: row;
    justify-content: unset;
    align-items: center;
  }
  #downloads li {
    margin-right: 6rem;
  }
  #downloads li:last-child {
    margin-right: 0;
  }
  #downloads h2 {
    line-height: 1;
  }
}

/* now let's talk about height */
@media (min-width: 768px) and (min-height: 775px) {
  main {
    min-height: 700px;
    max-height: 700px;
  }
}
/* Corinnes Macbook Air 1366 * 768 px */
@media (min-width: 1150px) and (min-height: 750px) {
  main {
    min-height: 600px;
    max-height: 600px;
  }
}


/* fullHD and above */
@media (min-width: 1900px) and (min-height: 1000px) {
  main {
    min-height: 800px;
    max-height: 800px;
    min-width: 1200px;
    max-width: 1200px;
  }
  h1, h2 {
    font-size: calc(3rem * 3);
  }
  h3 {
    font-size: 2rem;
  }
   #downloads li {
    margin-right: 9rem;
  }
  
}



/* imac and others */
@media (min-width: 3000px) and (min-height: 1750px) {
  main {
    min-height: 1300px;
    max-height: 1300px;
    min-width: 1750px;
    max-width: 1750px;
    margin: auto;
  }
  h1,
  h2 {
    font-size: 14rem;
  }
  h3 {
    font-size: 3rem;
  }
   #downloads li {
    margin-right: 14rem;
  }
}
</style>
