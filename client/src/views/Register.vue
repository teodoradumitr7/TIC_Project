<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card" id="registerForm">
          <div class="card-header">Register</div>
          <div class="card-body">
            <div v-if="error" class="alert alert-danger">{{error}}</div>
            <form action="#" @submit.prevent="Register">
              <div class="form-group">
                <label for="name" >Name</label>
                  <input
                    id="name"
                    type="name"
                    class="form-control form-control-lg"
                    name="name"
                    value
                    required
                    autofocus
                    v-model="name"
                  />
              </div>

              <div class="form-group">
                <label for="email">Email</label>

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
                <label for="password" >Password</label>
                  <input
                    id="password"
                    type="password"
                    class="form-control form-control-lg"
                    name="password"
                    required
                    v-model="password"
                  />
              </div>

              <div class="form-group ">
                <div class="col-md-8 offset-md-5">
                  <button type="submit" id="registerBtn" class="btn btn-dark btn-lg btn-block">Register</button>
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

export default {
  name: "RegisterComponent",
 setup() {
    const name = ref('')
    const email = ref('')
    const password = ref('')
    const error = ref(null)

    const store = useStore()
    const router = useRouter()

    const Register = async () => {
      try {
        await store.dispatch('register', {
          email: email.value,
          password: password.value,
          name: name.value
        })
        router.push('/')
      }
      catch (err) {
        error.value = "Can't create account. Please check email and password"
            }
    }

    return { Register, name,email, password, error }
  }
};
</script>
