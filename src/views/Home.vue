<template>
   <div  class="container" style="max-width: 400px; min-width: 360px">
     
    <section >

      <Header page="Home" :location=" location.locationName " />
        <div v-if="weather.hourData && weather.fiveDayData" class="content  centerpage meteo rounded my-3 shadow-lg  overflow-hidden" id="content">
          <div class="temperature-holder " style="margin: 10px 50px 20px;">
            <span class="value  text-white">{{ weather.hourData.Temperature.Value }}°C</span>
            <span class="phrase text-white">{{ weather.hourData.IconPhrase }}</span><br/>
            <router-link to="/favoris">
            <div>
                  <button class=" back-card meteo text-white" style="height: 40px; width: 150px; " v-on:click="favori()">Ajouter aux favoris</button>
                
            </div>
          </router-link>
            

          </div>
          <div class="days  meteo text-white" style="margin: 200px 100px 20px;">
            <span class="day back-card meteo text-white" v-for="(day, index) in weather.fiveDayData.DailyForecasts" :key="index" >
              <span class="temperature-value">{{ day.Temperature.Maximum.Value }}°C</span>
              <span class="day-date  text-white">{{ new Date( day.EpochDate*1000).toLocaleString("fr-EU", {day: '2-digit', year: '2-digit', month: '2-digit'}) }}</span>
            </span>
          </div>
        </div>
      <Loading v-else />
      <Footer />
  </section>
</div>
</template>

<script>
// import Fav from "../components/Favoris.vue"
import Header from "../components/Header"
import Footer from "../components/Footer"
import Loading from "../components/Loading"
import store from "../store"
import axios from "axios"
import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

export default{
  components: {Header, Footer, Loading},
  computed: {
    location () {
      return store.state.location
    },
    user () {
      return store.state.user
    },
    api () {
      return store.state.api
    },
    weather () {
      return store.state.weather
    }
  },
  mounted(){
    if(!this.location.search){
      if(!navigator.geolocation){
        if(!this.location.locationKey && !this.location.locationName){
          this.getIpAddress(true);
        }else{
          this.checkLocation();
        }
      }else{
        navigator.geolocation.getCurrentPosition(this.success, this.error)
      }
    }else{
      this.location.search = false;
      this.checkLocation();
    }
  },
  data() {
     return{
      // fav : [],
      // ville: this.location.locationName
     }
  },
  methods: {
    favori: function() {

      // fav = [],
      this.fav.push('ypoussss');
      console.log(fav)
    },
    // favori: function(ville){
    //   this.fav.push(ville);
    //   console.log(fav);
    // },
    getIpAddress(param = false){
      axios
        .get("https://api.ipify.org?format=json")
        .then((Response) => {
          this.user.ipAddress = Response.data.ip;
          if(param){this.getIpLocation()}
        })
        .catch((error) => {
          this.$notify({type: "error", text: error})
        })
    },
    getIpLocation(){
      axios
        .get("http://dataservice.accuweather.com/locations/v1/cities/ipaddress?apikey=" + this.api.apiKey + "&q=" + this.user.ipAddress + "&language=" + this.api.lang + "&details=false")
        .then((Response) => {
          this.location.locationKey = Response.data.ParentCity.Key,
          this.location.locationName = Response.data.ParentCity.EnglishName
          this.getWeatherData();
          this.get5DayWeatherData();
        })
        .catch((error) => {
          this.$notify({type: "error", text: error})
        })
    },
    getMeridianLocation(){
      axios
        .get("http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=" + this.api.apiKey + "&q=" + this.location.latitude + "," + this.location.longitude + "&language=" + this.api.lang + "&details=false&toplevel=false")
        .then((Response) => {
          this.location.locationKey = Response.data.Key,
          this.location.locationName = Response.data.LocalizedName
          this.getWeatherData();
          this.get5DayWeatherData();
        })
        .catch((error) => {
          this.$notify({type: "error", text: error})
        })
    },
    getWeatherData(){
      axios
        .get("https://dataservice.accuweather.com/forecasts/v1/hourly/1hour/" + this.location.locationKey + "?apikey=" + this.api.apiKey + "&language=" + this.api.lang + "&details=false&metric=true")
        .then((Response) => {
          this.weather.hourData = Response.data[0];
        })
        .catch((error) => {
          this.$notify({type: "error", text: error})
        })
    },
    get5DayWeatherData(){
      axios
        .get("http://dataservice.accuweather.com/forecasts/v1/daily/5day/" + this.location.locationKey + "?apikey=" + this.api.apiKey + "&language=" + this.api.lang + "&details=false&metric=true")
        .then((Response) => {
          this.weather.fiveDayData = Response.data;
        })
        .catch((error) => {
          this.$notify({type: "error", text: error})
        })
    },
    checkLocation(){
      if(this.weather.hourData != null && this.weather.hourData.Link.search(this.location.locationKey) == -1){
        this.weather.hourData = null;
        this.weather.fiveDayData = null;
        this.getWeatherData();
        this.get5DayWeatherData();
      }else{
        this.getWeatherData();
        this.get5DayWeatherData();
      }
    },
    success(position){
      this.location.latitude = position.coords.latitude;
      this.location.longitude = position.coords.longitude;
      this.getMeridianLocation();
    },
    error(){
      this.$notify({type: "error", text: "Could not get location"})
      !this.location.locationKey && !this.location.locationName ? this.getIpAddress(true) : this.checkLocation();
    }
  }
}

</script>
