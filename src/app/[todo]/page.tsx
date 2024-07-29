interface TodoPageParams {
  params: {
    todo: string;
  };
}

const TodoPage = async ({ params }: TodoPageParams) => {
  const { todo } = params;
  return <div>TodoPage - {todo}</div>;
};

export default TodoPage;
