import React, {useRef, useContext} from 'react';
import { useDrag, useDrop } from 'react-dnd';

import BoardContext from '../Board/context';

import { Container, Label } from './styles';

export default function Card( {data, index, listIndex} ) {
  const ref = useRef();
  const { move } = useContext(BoardContext);

  var id = data.id;
  var indexvariabel = index;
  var indexData = data.index;
  var listIndexVariable = listIndex;

const [{ isDragging }, dragRef] = useDrag({
    type:'CARD',
    item:{id, indexvariabel, listIndexVariable},
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, dropRef] = useDrop({
    accept: 'CARD',
    hover(item, monitor) {

      const draggedListIndex = item.listIndexVariable;
      const targetListIndex = listIndex;
      const draggedIndex = item.indexvariabel;
      const targetIndex = index;

      if(draggedIndex === targetIndex && draggedListIndex === targetIndex){
        return;
      } 
      const targetSize = ref.current.getBoundingClientRect();
      const targetCenter = (targetSize.bottom - targetSize.top)/2;
      const draggedOffset = monitor.getClientOffset();
      const draggedTop = draggedOffset.y - targetSize.top;

      if(draggedIndex < targetIndex && draggedTop < targetCenter) {
        return;
      }

      if(draggedIndex > targetIndex && draggedTop > targetCenter) {
        return;
      }

      move(draggedListIndex, targetListIndex, draggedIndex, targetIndex);

      item.indexvariabel= targetIndex;
      item.listIndexVariable = targetListIndex;

    }
  })

  dragRef(dropRef(ref));

  return (
    <Container ref={ref} isDragging={isDragging}>
      <header>
        {data.labels.map(label => <Label key={label} color={label} />)}
      </header>
      <p>{data.content}</p>
      {data.user && <img src={data.user} alt=""/> }
    </Container>
  )
}
