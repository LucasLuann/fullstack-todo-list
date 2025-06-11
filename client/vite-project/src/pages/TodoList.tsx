"use client"

import { DialogTrigger } from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, CheckCircle2, Circle, Calendar, Loader2 } from "lucide-react"

const TodoList = () => {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Estado do modal e campos
  const [title, setTitle] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const [open, setOpen] = useState(false)

  // Se está editando e qual id está editando
  const [editingId, setEditingId] = useState(null)

  // Adicionar após os estados existentes
  const [deleteMode, setDeleteMode] = useState(false)
  const [todoToDelete, setTodoToDelete] = useState(null)

  const fetchTodos = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/todos")
      if (!res.ok) throw new Error("Erro ao buscar tarefas")
      const data = await res.json()
      setTodos(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  // Criar ou editar tarefa
  const handleSubmit = async (e) => {
    e.preventDefault()

    const method = editingId ? "PUT" : "POST"
    const url = editingId ? `http://localhost:8080/api/todos/${editingId}` : "http://localhost:8080/api/todos"

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, isComplete }),
      })

      if (!res.ok) throw new Error("Erro ao salvar tarefa")

      setOpen(false)
      setTitle("")
      setIsComplete(false)
      setEditingId(null)
      fetchTodos()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDelete = (todo) => {
    setTodoToDelete(todo)
    setDeleteMode(true)
    setOpen(true)
  }


  const confirmDelete = async () => {
    if (!todoToDelete) return

    try {
      const res = await fetch(`http://localhost:8080/api/todos/${todoToDelete.id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Erro ao excluir tarefa")

      setOpen(false)
      setDeleteMode(false)
      setTodoToDelete(null)
      fetchTodos()
    } catch (err) {
      alert(err.message)
    }
  }

  // Abrir modal para edição
  const handleEdit = (todo) => {
    setEditingId(todo.id)
    setTitle(todo.title)
    setIsComplete(todo.isComplete)
    setOpen(true)
  }

  const completedCount = todos.filter((todo) => todo.isComplete).length
  const totalCount = todos.length

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-slate-600 mx-auto mb-4" />
          <p className="text-slate-600">Carregando tarefas...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6 text-center">
            <Circle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-700 font-medium">Erro: {error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">📋 Lista de Tarefas</h1>
          <p className="text-slate-600">Gerencie suas tarefas de forma simples e elegante</p>
        </div>

        {/* Total / Concluída */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="bg-white/70 backdrop-blur-sm border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Circle className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="text-sm text-slate-600">Total</p>
                  <p className="text-2xl font-bold text-slate-800">{totalCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-slate-600">Concluídas</p>
                  <p className="text-2xl font-bold text-green-600">{completedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quantidade de tarefas */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Suas Tarefas
            {totalCount > 0 && (
              <Badge variant="secondary" className="bg-slate-100 text-slate-700 ml-2">
                {completedCount}/{totalCount}
              </Badge>
            )}
          </h2>

          <Dialog
            open={open}
            onOpenChange={(open) => {
              setOpen(open)
              if (!open) {
                setEditingId(null)
                setTitle("")
                setIsComplete(false)
                setDeleteMode(false)
                setTodoToDelete(null)
              }
            }}
          >
            <DialogTrigger asChild>
              <Button className="bg-slate-800 hover:bg-slate-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Nova Tarefa
              </Button>
            </DialogTrigger>

            {/* Substituir todo o conteúdo do DialogContent por: */}
            <DialogContent className="sm:max-w-[425px] bg-white/95 backdrop-blur-sm">
              {deleteMode ? (
                // Modo de exclusão
                <>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                      <Trash2 className="w-5 h-5" />
                      Confirmar Exclusão
                    </DialogTitle>
                    <DialogDescription>
                      Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="py-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Circle className="w-4 h-4 text-red-500" />
                        <span className="font-medium text-red-800">Tarefa a ser excluída:</span>
                      </div>
                      <p className="text-red-700 font-semibold">{todoToDelete?.title}</p>
                      <p className="text-sm text-red-600 mt-1">
                        Status: {todoToDelete?.isComplete ? "Concluída" : "Pendente"}
                      </p>
                    </div>
                  </div>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="outline">
                        Cancelar
                      </Button>
                    </DialogClose>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={confirmDelete}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Confirmar Exclusão
                    </Button>
                  </DialogFooter>
                </>
              ) : (
                // Modo de adicionar/editar (conteúdo original)
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-slate-800">
                      <Plus className="w-5 h-5" />
                      {editingId ? "Editar Tarefa" : "Nova Tarefa"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingId ? "Altere os detalhes da tarefa abaixo." : "Inclua os detalhes da nova tarefa abaixo."}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-3">
                      <Label htmlFor="name-1" className="text-slate-700">
                        Título
                      </Label>
                      <Input
                        id="name-1"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ex: Limpar o quintal"
                        required
                        className="bg-white/50 border-slate-300 focus:border-slate-400"
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-green-600 has-[[aria-checked=true]]:bg-green-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950 bg-white/30">
                        <Checkbox
                          checked={isComplete}
                          onCheckedChange={(checked) => setIsComplete(checked === true)}
                          className="data-[state=checked]:border-green-600 data-[state=checked]:bg-green-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                        />
                        <div className="grid gap-1.5 font-normal">
                          <p className="text-sm leading-none font-medium text-slate-800">Tarefa Finalizada</p>
                          <p className="text-muted-foreground text-sm">Marque caso a tarefa já tenha sido concluída.</p>
                        </div>
                      </Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="outline">
                        Cancelar
                      </Button>
                    </DialogClose>
                    <Button type="submit" className="bg-slate-800 hover:bg-slate-700">
                      {editingId ? "Salvar Alterações" : "Salvar"}
                    </Button>
                  </DialogFooter>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </div>

        {/* Lista de Tarefas */}
        {todos.length === 0 ? (
          <Card className="bg-white/70 backdrop-blur-sm border-slate-200">
            <CardContent className="text-center py-12">
              <Circle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg mb-2">Nenhuma tarefa encontrada</p>
              <p className="text-slate-400">Clique em "Nova Tarefa" para começar!</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-6">
              {todos.map((todo) => (
                <Card
                  key={todo.id}
                  className={`group transition-all duration-200 hover:shadow-lg ${
                    todo.isComplete
                      ? "bg-green-50/70 border-green-200 backdrop-blur-sm"
                      : "bg-white/70 border-slate-200 backdrop-blur-sm hover:border-slate-300"
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle
                        className={`text-lg leading-tight ${
                          todo.isComplete ? "text-green-800 line-through" : "text-slate-800"
                        }`}
                      >
                        {todo.title}
                      </CardTitle>
                      <Badge
                        variant={todo.isComplete ? "default" : "secondary"}
                        className={`shrink-0 ${
                          todo.isComplete ? "bg-green-600 text-white" : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {todo.isComplete ? (
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                        ) : (
                          <Circle className="w-3 h-3 mr-1" />
                        )}
                        {todo.isComplete ? "Concluída" : "Pendente"}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(todo)}
                        className="flex-1 bg-white/50 hover:bg-white/80"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        // Substituir a linha do onClick do botão Excluir por:
                        onClick={() => handleDelete(todo)}
                        className="flex-1 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Excluir
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Barra de Progresso */}
            {totalCount > 0 && (
              <Card className="bg-white/70 backdrop-blur-sm border-slate-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">Progresso Geral</span>
                    <span className="text-sm text-slate-600">{Math.round((completedCount / totalCount) * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${(completedCount / totalCount) * 100}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default TodoList
