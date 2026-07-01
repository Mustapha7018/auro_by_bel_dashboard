<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/store/auth'

const auth = useAuthStore()
const email = ref('')
const password = ref('')

const submit = () => auth.signIn(email.value.trim(), password.value)
</script>

<template>
  <div class="login">
    <div class="login__card card">
      <div class="login__brand">
        <span class="login__logo">A</span>
        <div>
          <p class="login__name">Aura <em>by</em> Bel</p>
          <p class="login__sub">Studio dashboard</p>
        </div>
      </div>

      <h1 class="login__title">Welcome back, Bel</h1>
      <p class="login__lead">Sign in to manage your studio.</p>

      <form @submit.prevent="submit">
        <div class="field">
          <label>Email</label>
          <input v-model="email" type="email" class="input" autocomplete="username" placeholder="you@studio.com" required />
        </div>
        <div class="field">
          <label>Password</label>
          <input v-model="password" type="password" class="input" autocomplete="current-password" placeholder="••••••••" required />
        </div>

        <p v-if="auth.error" class="login__error">{{ auth.error }}</p>

        <button type="submit" class="btn btn--primary" :disabled="auth.busy" style="width: 100%; margin-top: 0.3rem">
          {{ auth.busy ? 'Signing in…' : 'Sign in' }}
        </button>
      </form>

      <p class="login__demo">
        Demo access — <strong>bel@aurabybel.com</strong> / <strong>studio</strong>
      </p>
    </div>
  </div>
</template>

<style scoped>
.login {
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 1.5rem;
  background:
    radial-gradient(60% 50% at 80% 0%, var(--accent-soft), transparent 60%),
    radial-gradient(50% 45% at 0% 100%, var(--gold-soft), transparent 55%),
    var(--bg);
}
.login__card {
  width: min(24rem, 100%);
  padding: clamp(1.6rem, 4vw, 2.4rem);
}
.login__brand {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: 1.6rem;
}
.login__logo {
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--accent), var(--gold));
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 700;
}
.login__name {
  font-weight: 600;
}
.login__name em {
  font-style: italic;
  font-weight: 400;
  color: var(--ink-faint);
}
.login__sub {
  font-size: 0.68rem;
  color: var(--ink-faint);
  letter-spacing: 0.04em;
}
.login__title {
  font-size: 1.4rem;
}
.login__lead {
  color: var(--ink-faint);
  font-size: 0.86rem;
  margin: 0.3rem 0 1.4rem;
}
.login__error {
  color: var(--red);
  font-size: 0.8rem;
  margin-bottom: 0.6rem;
}
.login__demo {
  margin-top: 1.2rem;
  font-size: 0.72rem;
  color: var(--ink-faint);
  text-align: center;
}
</style>
