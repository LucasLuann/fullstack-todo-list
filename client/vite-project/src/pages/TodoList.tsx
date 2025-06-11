import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [title, setTitle] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [open, setOpen] = useState(false); // controla o estado do modal

  const fetchTodos = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/todos");
      if (!res.ok) throw new Error("Erro ao buscar tarefas");
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, isComplete }),
      });

      if (!res.ok) throw new Error("Erro ao salvar tarefa");

      // Fecha o modal e recarrega a lista
      setOpen(false);
      setTitle("");
      setIsComplete(false);
      fetchTodos();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div>Carregando tarefas...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">📋 Minhas Tarefas</h2>

        {todos.length === 0 ? (
          <div className="text-muted-foreground">
            Nenhuma tarefa encontrada.
          </div>
        ) : (
          <div className="grid gap-4">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className={`rounded-xl border p-4 shadow-sm transition-all ${
                  todo.isComplete
                    ? "bg-green-50 border-green-400 dark:bg-green-950 dark:border-green-700"
                    : "bg-muted/30 border-muted dark:bg-zinc-900"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium">{todo.title}</span>
                  <span
                    className={`text-sm font-semibold px-2 py-1 rounded-full ${
                      todo.isComplete
                        ? "bg-green-600 text-white"
                        : "bg-gray-400 text-white dark:bg-gray-700"
                    }`}
                  >
                    {todo.isComplete ? "Concluída" : "Pendente"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Incluir</Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Incluir Tarefa</DialogTitle>
              <DialogDescription>
                Inclua os detalhes da nova tarefa abaixo.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-3">
                <Label htmlFor="name-1">Título</Label>
                <Input
                  id="name-1"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Limpar o quintal"
                />
              </div>
              <div className="grid gap-3">
                <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-green-600 has-[[aria-checked=true]]:bg-green-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
                  <Checkbox
                    checked={isComplete}
                    onCheckedChange={(checked) =>
                      setIsComplete(checked === true)
                    }
                    className="data-[state=checked]:border-green-600 data-[state=checked]:bg-green-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                  />
                  <div className="grid gap-1.5 font-normal">
                    <p className="text-sm leading-none font-medium">
                      Tarefa Finalizada
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Marque caso a tarefa já tenha sido concluída.
                    </p>
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
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TodoList;
