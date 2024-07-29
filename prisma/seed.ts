import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create TodoLists with associated Todos
  await prisma.todoList.create({
    data: {
      name: 'Daily Tasks',
      todos: {
        create: [
          {
            name: 'Buy groceries',
            completed: false,
            priority: 1,
            dueDate: new Date('2024-07-30'),
            tags: ['shopping', 'urgent'],
          },
          {
            name: 'Read a book',
            completed: false,
            priority: 2,
            dueDate: new Date('2024-08-01'),
            tags: ['leisure'],
          },
        ],
      },
    },
  });

  await prisma.todoList.create({
    data: {
      name: 'Work Projects',
      todos: {
        create: [
          {
            name: 'Finish report',
            completed: false,
            priority: 1,
            dueDate: new Date('2024-07-31'),
            tags: ['work', 'urgent'],
          },
          {
            name: 'Plan meeting agenda',
            completed: false,
            priority: 2,
            dueDate: new Date('2024-08-02'),
            tags: ['work', 'planning'],
          },
        ],
      },
    },
  });

  console.log('Seed data created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
