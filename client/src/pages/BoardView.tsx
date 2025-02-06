import ListContainer from "@/components/list/ListContainer";
import { useStore } from "@/hooks/store/useStore";
import { useBoard } from "@/hooks/useBoards";
import { useLists } from "@/hooks/useLists";
import { useParams } from "react-router-dom";

const BoardView = () => {
  const { board_id } = useParams();
  const { organization_id } = useStore();
  const { GetBoard } = useBoard(organization_id);

  if (!board_id) {
    return <h1>error</h1>;
  }

  const { lists } = useLists(board_id);

  const { data } = GetBoard(board_id);

  if (!data) {
    return <h1>error</h1>;
  }

  return (
    <div className="flex h-full w-full overflow-x-scroll">
      <div>
        <h1>{organization_id}</h1>
        <ListContainer board_id={board_id} data={lists.data} />
      </div>
    </div>
  );
};

export default BoardView;
