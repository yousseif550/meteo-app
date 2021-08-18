<template>
   <div class="container " style="max-width: 400px; min-width: 360px" >
     
    <section >
      <Header page="Favoris" :location="false"  />
        <div v-if="weather.hourData && weather.fiveDayData" class="content  centerpage meteo rounded my-3 shadow-lg  overflow-hidden" id="content"  >
          <div class=" "  >
            <span class="phrase text-white" style=" ">VOS VILLES FAVORITES</span>
          </div>
          <div class="container" style="margin-top: 40px">
                <div class="row" >
                    <div class="col">
                        <span class="phrase text-white" style="margin-let: 20px">{{ location.locationName }}</span>
                    </div>
                    <div class="col">
                        <span class="day back-card bg-dark text-white" style="margin-bottom: 40px">
                            <span class="temperature-value">{{ weather.hourData.Temperature.Value }}°C</span>
                        </span>
                    </div>
                </div>
            </div>
            
          </div>
      <Loading v-else />
      <Footer />
    </section>
  </div>
</template>

<script>
import Header from "../components/Header"
import Footer from "../components/Footer"
import Loading from "../components/Loading"
import store from "../store"
import axios from "axios"

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
  methods: {
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
