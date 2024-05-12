import { Box, Image } from '@mantine/core'
import DraggableArea from '../../../../../../../../components/DraggableArea'
import { DroppableData, SubService, serviceConfig } from '../../../../constants'

interface Props {
  subService: SubService
}

export default function SubServiceComponent({ subService }: Props) {
  const draggableProps: DroppableData = {
    draggableType: 'subService',
    node: subService,
  }

  return (
    <DraggableArea id={subService.id} data={draggableProps}>
      <Box style={{ border: '1px solid red' }}>
        <Image
          h="1.8rem"
          w="1.8rem"
          src={serviceConfig[subService.serviceIdType]?.imageUrl}
          alt="props.data.imageUrl"
        />
      </Box>
    </DraggableArea>
  )
}