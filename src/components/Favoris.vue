<template>
  <div id="app" class="">
    <vs-button  color="primary" type="filled"  v-on:click="ajout(ville)">Danger</vs-button>
   </div>
</template>


<script>
  import VsButton from '@vuesimple/vs-button';
  import Vue from 'vue' 

  var app = new Vue ({
    el: "#app",
    data: {
      ville: 'MORONI',
      favoris: []
    },
    methods:{
      ajout: function(ville) {
        this.favoris.push(ville);
        console.log(this.favoris)
      }
    },
    components: {
      VsButton,
    },
  })
    

</script>

  
<style>

</style>