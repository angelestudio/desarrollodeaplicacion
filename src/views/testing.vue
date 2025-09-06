<!-- C:\Users\angel\OneDrive\Desktop\arreglo\front\desarrollodeaplicacion\src\views\testing.vue -->
<script setup lang="ts">
import axios from 'axios'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

/**
 * Helpers
 */
const getAuthToken = () => {
  return (
    localStorage.getItem('token') ||
    localStorage.getItem('accessToken') ||
    localStorage.getItem('authToken') ||
    ''
  )
}

const extractId = (res: any) => {
  if (!res) return null
  if (typeof res === 'string') return res
  if (res._id) return res._id
  if (res.id) return res.id
  if (res.data) {
    if (res.data._id) return res.data._id
    if (res.data.id) return res.data.id
    // controller notifications returns { data: notification }
    if (res.data.data && (res.data.data._id || res.data.data.id)) {
      return res.data.data._id || res.data.data.id
    }
  }
  return null
}

/**
 * Main test runner
 */
const testCrud = async () => {
  try {
    const token = getAuthToken()
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {}
    const logs: string[] = []
    const totalStart = performance.now()

    // -----------------------------
    // 1️⃣ CLUBS CRUD
    // -----------------------------
    let createdClubIdForUserActions: string | null = null
    try {
      let start = performance.now()
      const createRes = await axios.post(
        '/clubs',
        { name: `Club-${Math.floor(Math.random() * 1000)}`, description: 'Generado en test' },
        { headers: authHeaders }
      )
      logs.push(`CLUB CREATE: ${(performance.now() - start).toFixed(2)} ms`)
      const createdClub = createRes.data
      const createdClubId = extractId(createdClub)
      // we'll delete this club later (this is the general clubs test club)
      start = performance.now()
      await axios.get('/clubs', { headers: authHeaders })
      logs.push(`CLUB READ: ${(performance.now() - start).toFixed(2)} ms`)

      start = performance.now()
      if (createdClubId) {
        await axios.patch(
          `/clubs/${createdClubId}`,
          { description: 'Descripción actualizada en test' },
          { headers: authHeaders }
        )
        logs.push(`CLUB UPDATE: ${(performance.now() - start).toFixed(2)} ms`)

        start = performance.now()
        await axios.delete(`/clubs/${createdClubId}`, { headers: authHeaders })
        logs.push(`CLUB DELETE: ${(performance.now() - start).toFixed(2)} ms`)
      } else {
        logs.push('CLUB UPDATE/DELETE: SKIPPED (no se obtuvo ID)')
      }

      // create another club specifically to use later with usuarios (keep id)
      start = performance.now()
      const clubForUserRes = await axios.post(
        '/clubs',
        { name: `ClubUser-${Math.floor(Math.random() * 1000)}`, description: 'Club para pruebas de usuario' },
        { headers: authHeaders }
      )
      createdClubIdForUserActions = extractId(clubForUserRes.data)
      logs.push(`CLUB (for user) CREATE: ${(performance.now() - start).toFixed(2)} ms`)
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || JSON.stringify(err)
      logs.push(`CLUB SECCIÓN: ERROR -> ${msg}`)
    }

    // -----------------------------
    // 2️⃣ NEWS CRUD (requiere token para POST)
    // -----------------------------
    try {
      let start = performance.now()
      const newsPayload = {
        title: `Noticia Test ${Math.floor(Math.random() * 1000)}`,
        content: 'Contenido de prueba para la noticia generado por el test. Debe tener al menos 10 caracteres.'
      }
      const createNewsRes = await axios.post('/news', newsPayload, { headers: authHeaders })
      logs.push(`NEWS CREATE: ${(performance.now() - start).toFixed(2)} ms`)
      const createdNewsId = extractId(createNewsRes.data)

      start = performance.now()
      await axios.get('/news', { headers: authHeaders })
      logs.push(`NEWS READ: ${(performance.now() - start).toFixed(2)} ms`)

      if (createdNewsId) {
        start = performance.now()
        await axios.put(`/news/${createdNewsId}`, { title: `${newsPayload.title} (EDITADO)`, content: 'Contenido editado desde test - sigue teniendo más de 10 caracteres.' }, { headers: authHeaders })
        logs.push(`NEWS UPDATE: ${(performance.now() - start).toFixed(2)} ms`)

        start = performance.now()
        await axios.delete(`/news/${createdNewsId}`, { headers: authHeaders })
        logs.push(`NEWS DELETE: ${(performance.now() - start).toFixed(2)} ms`)
      } else {
        logs.push('NEWS UPDATE/DELETE: SKIPPED (no se obtuvo ID)')
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || JSON.stringify(err)
      logs.push(`NEWS SECCIÓN: ERROR -> ${msg}`)
    }

    // -----------------------------
    // 3️⃣ NOTIFICATIONS CRUD
    // -----------------------------
    let createdNotifId: string | null = null
    try {
      let start = performance.now()
      const notifPayload = { title: `Notificación Test ${Math.floor(Math.random()*1000)}`, content: 'Contenido de notificación generado por test.', type: 'info' }
      const createNotifRes = await axios.post('/notifications', notifPayload, { headers: authHeaders })
      logs.push(`NOTIF CREATE: ${(performance.now() - start).toFixed(2)} ms`)
      const createdNotif = createNotifRes.data?.data || createNotifRes.data
      createdNotifId = extractId(createdNotif)

      start = performance.now()
      await axios.get('/notifications', { params: { type: 'info' }, headers: authHeaders })
      logs.push(`NOTIF READ (type=info): ${(performance.now() - start).toFixed(2)} ms`)

      if (createdNotifId) {
        start = performance.now()
        await axios.put(`/notifications/${createdNotifId}`, { title: `${notifPayload.title} (EDITADA)`, content: `${notifPayload.content} - editada desde test.`, type: 'warning' }, { headers: authHeaders })
        logs.push(`NOTIF UPDATE: ${(performance.now() - start).toFixed(2)} ms`)
      } else {
        logs.push('NOTIF UPDATE: SKIPPED (no se obtuvo ID)')
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || JSON.stringify(err)
      logs.push(`NOTIFICATIONS SECCIÓN: ERROR -> ${msg}`)
    }

    // -----------------------------
    // 4️⃣ POSTS CRUD + Likes + Comments
    // -----------------------------
    try {
      if (!token) {
        logs.push('POSTS SECCIÓN: SKIPPED (no hay token en localStorage)')
      } else {
        let start = performance.now()
        const createPostPayload = { title: `Post Test ${Math.floor(Math.random()*1000)}`, content: 'Contenido de prueba para post desde el test.', club: createdClubIdForUserActions || 'club-test' }
        const createPostRes = await axios.post('/posts', createPostPayload, { headers: authHeaders })
        logs.push(`POST CREATE: ${(performance.now() - start).toFixed(2)} ms`)
        const createdPostId = extractId(createPostRes.data)

        start = performance.now()
        await axios.get('/posts', { headers: authHeaders })
        logs.push(`POST READ (all): ${(performance.now() - start).toFixed(2)} ms`)

        if (createdPostId) {
          start = performance.now()
          await axios.patch(`/posts/${createdPostId}`, { title: `${createPostPayload.title} (EDITADO)`, content: `${createPostPayload.content} - editado desde test.` }, { headers: authHeaders })
          logs.push(`POST UPDATE: ${(performance.now() - start).toFixed(2)} ms`)

          // Like
          start = performance.now()
          try {
            await axios.post(`/posts/${createdPostId}/like`, {}, { headers: authHeaders })
            logs.push(`POST LIKE: ${(performance.now() - start).toFixed(2)} ms`)
          } catch (likeErr: any) {
            logs.push(`POST LIKE: ERROR -> ${likeErr?.response?.data?.message || likeErr?.message || JSON.stringify(likeErr)}`)
          }

          // Unlike
          start = performance.now()
          try {
            await axios.delete(`/posts/${createdPostId}/like`, { headers: authHeaders })
            logs.push(`POST UNLIKE: ${(performance.now() - start).toFixed(2)} ms`)
          } catch (unlikeErr: any) {
            logs.push(`POST UNLIKE: ERROR -> ${unlikeErr?.response?.data?.message || unlikeErr?.message || JSON.stringify(unlikeErr)}`)
          }

          // Comments: add, list, delete
          let createdCommentId: string | null = null
          start = performance.now()
          try {
            const addCommentRes = await axios.post(`/posts/${createdPostId}/comments`, { content: 'Comentario de prueba desde test' }, { headers: authHeaders })
            logs.push(`COMMENT ADD: ${(performance.now() - start).toFixed(2)} ms`)
            createdCommentId = extractId(addCommentRes.data) || (addCommentRes.data && addCommentRes.data._id) || null
          } catch (cErr: any) {
            logs.push(`COMMENT ADD: ERROR -> ${cErr?.response?.data?.message || cErr?.message || JSON.stringify(cErr)}`)
          }

          start = performance.now()
          try {
            await axios.get(`/posts/${createdPostId}/comments`, { headers: authHeaders })
            logs.push(`COMMENTS READ: ${(performance.now() - start).toFixed(2)} ms`)
          } catch (cReadErr: any) {
            logs.push(`COMMENTS READ: ERROR -> ${cReadErr?.response?.data?.message || cReadErr?.message || JSON.stringify(cReadErr)}`)
          }

          if (createdCommentId) {
            start = performance.now()
            try {
              await axios.delete(`/posts/${createdPostId}/comments/${createdCommentId}`, { headers: authHeaders })
              logs.push(`COMMENT DELETE: ${(performance.now() - start).toFixed(2)} ms`)
            } catch (cDelErr: any) {
              logs.push(`COMMENT DELETE: ERROR -> ${cDelErr?.response?.data?.message || cDelErr?.message || JSON.stringify(cDelErr)}`)
            }
          } else {
            logs.push('COMMENT DELETE: SKIPPED (no se obtuvo ID del comentario)')
          }

          // Delete post (requires admin)
          start = performance.now()
          try {
            await axios.delete(`/posts/${createdPostId}`, { headers: authHeaders })
            logs.push(`POST DELETE: ${(performance.now() - start).toFixed(2)} ms`)
          } catch (pDelErr: any) {
            const status = pDelErr?.response?.status
            if (status === 403) {
              logs.push(`POST DELETE: SKIPPED (no autorizado - requiere admin) -> ${pDelErr?.response?.data?.message || pDelErr?.message}`)
            } else {
              logs.push(`POST DELETE: ERROR -> ${pDelErr?.response?.data?.message || pDelErr?.message || JSON.stringify(pDelErr)}`)
            }
          }
        } else {
          logs.push('POST UPDATE/LIKE/COMMENTS/DELETE: SKIPPED (no se obtuvo ID del post)')
        }
      }
    } catch (err: any) {
      logs.push(`POSTS SECCIÓN: ERROR -> ${err?.response?.data?.message || err?.message || JSON.stringify(err)}`)
    }

    // -----------------------------
    // 5️⃣ USUARIOS CRUD (create, login, findAll, findOne, patch about, add/remove club)
    // -----------------------------
    let createdUserId: string | null = null
    try {
      // 1) Create user (email random to avoid duplicates)
      let start = performance.now()
      const random = Math.floor(Math.random() * 100000)
      const userPayload = {
        firstName: 'TestFirst',
        lastName: 'TestLast',
        role: 'user',
        phone: '3000000000',
        email: `test.user.${random}@example.com`,
        password: '123456',
        clubs: []
      }
      const createUserRes = await axios.post('/usuarios', userPayload)
      logs.push(`USER CREATE: ${(performance.now() - start).toFixed(2)} ms`)
      createdUserId = extractId(createUserRes.data) || createUserRes.data?._id || null

      // 2) Login (controller returns user object in your backend; if your real login returns token, you can store it)
      start = performance.now()
      try {
        const loginRes = await axios.post('/usuarios/login', { email: userPayload.email, password: userPayload.password })
        logs.push(`USER LOGIN: ${(performance.now() - start).toFixed(2)} ms`)
        // If login returned a token in your real backend, you'd store it:
        // localStorage.setItem('token', loginRes.data.token)
      } catch (loginErr: any) {
        logs.push(`USER LOGIN: ERROR -> ${loginErr?.response?.data?.message || loginErr?.message || JSON.stringify(loginErr)}`)
      }

      // 3) Find all users
      start = performance.now()
      await axios.get('/usuarios')
      logs.push(`USERS READ (all): ${(performance.now() - start).toFixed(2)} ms`)

      // 4) Find one (by id)
      if (createdUserId) {
        start = performance.now()
        await axios.get(`/usuarios/${createdUserId}`)
        logs.push(`USER READ (by id): ${(performance.now() - start).toFixed(2)} ms`)
      } else {
        logs.push('USER READ (by id): SKIPPED (no se obtuvo ID al crear usuario)')
      }

      // 5) Update about (PATCH :id/about)
      if (createdUserId) {
        start = performance.now()
        await axios.patch(`/usuarios/${createdUserId}/about`, { about: 'Este es el about editado desde el test' })
        logs.push(`USER UPDATE ABOUT: ${(performance.now() - start).toFixed(2)} ms`)
      } else {
        logs.push('USER UPDATE ABOUT: SKIPPED (no se obtuvo ID)')
      }

      // 6) Add Club to user (PATCH :userId/clubs/:clubId) and Remove (DELETE :userId/clubs/:clubId)
      if (createdUserId && createdClubIdForUserActions) {
        start = performance.now()
        await axios.patch(`/usuarios/${createdUserId}/clubs/${createdClubIdForUserActions}`)
        logs.push(`USER ADD CLUB: ${(performance.now() - start).toFixed(2)} ms`)

        start = performance.now()
        await axios.delete(`/usuarios/${createdUserId}/clubs/${createdClubIdForUserActions}`)
        logs.push(`USER REMOVE CLUB: ${(performance.now() - start).toFixed(2)} ms`)
      } else {
        logs.push('USER ADD/REMOVE CLUB: SKIPPED (falta userId o clubId)')
      }
    } catch (err: any) {
      logs.push(`USUARIOS SECCIÓN: ERROR -> ${err?.response?.data?.message || err?.message || JSON.stringify(err)}`)
    }

    // -----------------------------
    // 6️⃣ REPORT (GET /report)
    // -----------------------------
    try {
      const start = performance.now()
      await axios.get('/report')
      logs.push(`REPORT GET: ${(performance.now() - start).toFixed(2)} ms`)
    } catch (err: any) {
      logs.push(`REPORT SECCIÓN: ERROR -> ${err?.response?.data?.message || err?.message || JSON.stringify(err)}`)
    }

    // -----------------------------
    // Clean-up: eliminar el club creado para user actions (si existe)
    // -----------------------------
    if (createdClubIdForUserActions) {
      try {
        await axios.delete(`/clubs/${createdClubIdForUserActions}`, { headers: authHeaders })
        logs.push('CLEANUP: club creado para user actions eliminado')
      } catch (err: any) {
        logs.push(`CLEANUP: no se pudo eliminar club (puede requerir auth/admin) -> ${err?.response?.data?.message || err?.message || JSON.stringify(err)}`)
      }
    }

    // -----------------------------
    // FIN - resumen
    // -----------------------------
    logs.push(`TOTAL: ${(performance.now() - totalStart).toFixed(2)} ms`)
    toast.success(`✅ CRUD Test completado\n${logs.join('\n')}`, { autoClose: 10000, position: 'bottom-right' })
    console.table(logs)
  } catch (err: any) {
    const serverMsg = err?.response?.data?.message || err?.response?.data?.error || err?.message || JSON.stringify(err)
    toast.error(`❌ Error en test: ${serverMsg}`, { autoClose: 10000, position: 'bottom-right' })
    console.error('Error en testCrud:', err)
  }
}
</script>

<template>
  <div class="p-4">
    <h1 class="text-xl font-bold mb-4">Testing CRUD completo (Clubs, News, Notifications, Posts, Usuarios, Report)</h1>
    <button
      @click="testCrud"
      class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
    >
      Probar CRUD completo
    </button>

    <ul class="text-sm text-gray-600 mt-3">
      <li>- Nota: muchas rutas (news, posts) requieren JWT. Si tienes token guárdalo en localStorage como 'token' (o 'accessToken'/'authToken').</li>
      <li>- El endpoint para borrar posts requiere rol <strong>admin</strong> en el token — si no tienes admin, la prueba marcará la eliminación como saltada.</li>
      <li>- El test crea automáticamente un club para las pruebas de usuario y lo intenta eliminar al final; esto puede requerir permisos en el backend.</li>
      <li>- Si tu backend devuelve token en /usuarios/login ajusta el bloque de login para guardar `localStorage.setItem('token', token)`.</li>
    </ul>
  </div>
</template>
