<template>
  <div class="p-6 bg-green-100 min-h-screen">
    <div class="mb-4">
      <router-link to="/profile" class="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded shadow">← Volver al perfil</router-link>
    </div>

    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold mb-6 text-green-900">Reporte del Sistema</h1>
      <button @click="exportarAPDF" class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded shadow mb-6">📄 Exportar a PDF</button>
    </div>

    <section class="mb-10 bg-white p-4 rounded shadow">
      <h2 class="text-2xl font-semibold text-green-800 mb-4">Posts por Club</h2>
      <canvas id="graficoPostsPorClub"></canvas>
    </section>

    <section class="mb-10">
      <h2 class="text-2xl font-semibold text-green-800 mb-2">Usuarios</h2>
      <div class="overflow-auto rounded shadow bg-white">
        <table class="min-w-full table-auto text-sm">
          <thead class="bg-green-200 text-green-900">
            <tr><th class="p-2 text-left">Nombre</th><th class="p-2 text-left">Correo</th><th class="p-2 text-left">Rol</th><th class="p-2 text-left">Clubs</th></tr>
          </thead>
          <tbody>
            <tr v-for="user in reporte.usuarios" :key="user._id" class="border-b">
              <td class="p-2">{{ user.firstName }} {{ user.lastName }}</td>
              <td class="p-2">{{ user.email }}</td>
              <td class="p-2">{{ user.role }}</td>
              <td class="p-2">{{ user.clubs?.join(', ') || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section>
      <h2 class="text-2xl font-semibold text-green-800 mb-2">Posts</h2>
      <div class="space-y-4">
        <div v-for="post in reporte.posts" :key="post._id" class="p-4 bg-white shadow rounded">
          <h3 class="text-xl font-bold text-green-900">{{ post.title }}</h3>
          <p class="text-green-800 mb-1">{{ post.content }}</p>
          <p class="text-sm text-green-600">Club: {{ post.club }} | Likes: {{ post.likesCount }}</p>
          <div class="mt-3">
            <h4 class="font-semibold text-green-700">Comentarios:</h4>
            <ul class="list-disc list-inside text-sm text-green-700">
              <li v-for="comentario in post.comentarios" :key="comentario._id"><strong>{{ comentario.username }}:</strong> {{ comentario.content }}</li>
              <li v-if="post.comentarios.length === 0" class="text-gray-500">Sin comentarios</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import axios from 'axios'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import Chart from 'chart.js/auto'

interface Usuario { _id: string; firstName: string; lastName: string; email: string; role: string; clubs: string[] }
interface Comentario { _id: string; postId: string; userId: string; username: string; content: string }
interface Post { _id: string; title: string; content: string; club: string; user: string; likedBy: string[]; likesCount: number; comentarios: Comentario[] }
interface Reporte { usuarios: Usuario[]; posts: Post[] }

const reporte = ref<Reporte>({ usuarios: [], posts: [] })

function generarGrafico() {
  const conteo: Record<string, number> = {}
  reporte.value.posts.forEach(p => conteo[p.club] = (conteo[p.club] || 0) + 1)
  const labels = Object.keys(conteo)
  const data = Object.values(conteo)
  const ctx = document.getElementById('graficoPostsPorClub') as HTMLCanvasElement
  if (!ctx) return
  new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets: [{ label: 'Cantidad de Posts', data, backgroundColor: 'rgba(34,197,94,0.6)', borderColor: 'rgba(22,163,74,1)', borderWidth: 1 }] },
    options: { responsive: true, scales: { y: { beginAtZero: true } } }
  })
}

onMounted(async () => {
  try {
    const res = await axios.get<Reporte>('http://localhost:3000/report')
    reporte.value = res.data
    await nextTick()
    generarGrafico()
  } catch (err) { console.error('Error al cargar el reporte:', err) }
})

function exportarAPDF() {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' })
  const pw = doc.internal.pageSize.getWidth()
  let y = 40
  doc.setFontSize(18)
  doc.text('Reporte del Sistema', pw / 2, y, { align: 'center' })
  y += 30
  doc.setFontSize(14)
  doc.text('Usuarios', 40, y)
  y += 10
  autoTable(doc, {
    startY: y,
    head: [['Nombre','Correo','Rol','Clubs']],
    body: reporte.value.usuarios.map(u => [`${u.firstName} ${u.lastName}`, u.email, u.role, u.clubs.join(', ') || '-']),
    theme: 'striped',
    headStyles: { fillColor: [34,197,94] },
    margin: { left: 40, right: 40 },
    styles: { fontSize: 10 },
    didDrawPage: (data: any) => { y = data.cursor.y + 20 }
  })
  doc.setFontSize(14)
  doc.text('Posts', 40, y)
  y += 10
  for (const post of reporte.value.posts) {
    if (y > doc.internal.pageSize.getHeight() - 100) { doc.addPage(); y = 40 }
    doc.setFontSize(12)
    doc.text(`• ${post.title}`, 50, y); y += 16
    doc.setFontSize(10)
    const split = doc.splitTextToSize(post.content, pw - 100)
    doc.text(split, 60, y); y += split.length * 12 + 4
    doc.text(`Club: ${post.club} | Likes: ${post.likesCount}`, 60, y); y += 16
    if (post.comentarios.length) {
      doc.setFont('helvetica','italic')
      doc.text('Comentarios:', 60, y)
      doc.setFont('helvetica','normal')
      y += 14
      for (const c of post.comentarios) {
        if (y > doc.internal.pageSize.getHeight() - 60) { doc.addPage(); y = 40 }
        const line = `${c.username}: ${c.content}`
        const sl = doc.splitTextToSize(line, pw - 120)
        doc.text(sl, 70, y)
        y += sl.length * 12 + 4
      }
    } else {
      doc.setFontSize(10)
      doc.setTextColor(120)
      doc.text('Sin comentarios', 60, y)
      doc.setTextColor(0)
      y += 16
    }
    y += 10
  }
  doc.save('reporte-del-sistema.pdf')
}
</script>

<style scoped>
table th, table td { border: 1px solid #c4f0c4; }
</style>