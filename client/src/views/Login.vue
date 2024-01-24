<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-8" >
        <div class="card" id="loginForm" >
          <div class="card-header" >Login</div>
          <div class="card-body">
            <div v-if="error" class="alert alert-danger">{{error}}</div>
            <form action="#"  @submit.prevent="Login" >
              <div class="form-group">
                <label for="email" >Email</label>
                  <input
                    id="email"
                    type="email"
                    class="form-control form-control-lg"
                    name="email"
                    value
                    required
                    autofocus
                    v-model="email"
                  />

              </div>

              <div class="form-group">
                <label for="password">Password</label>

                  <input
                    id="password"
                    type="password"
                    class="form-control form-control-lg"
                    name="password"
                    required
                    v-model="password"
                  />

              </div>

              <div class="form-group">
                <div class="col-md-8 offset-md-5">
                  <button type="submit" id="loginBtn" class="btn btn-dark btn-lg btn-block">Login</button>
              </div>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { requestOptions, base_url } from "@/requestOptions";

export default {
  name: "LoginComponent",
    setup() {
    const email = ref('')
    const password = ref('')
    const error = ref(null)

    const store = useStore()
    const router = useRouter()

    const Login = async () => {
      try {
        await store.dispatch('logIn', {
          email: email.value,
          password: password.value
        })
        let emailVal={}
        emailVal.email=email.value
        console.log(emailVal)
        router.push({path:"/dashboard",query:emailVal})
      }
      catch (err) {
        error.value = err.message
      }
    }
    return { Login, email, password, error }
  }
};
</script>

