import OnboardingContextProvider from '@/contexts/Onboarding/OnboardingProvider'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { AppShell } from '@mantine/core'
import { useEdgesState, useNodesState, useReactFlow } from 'reactflow'
import ClickCanvaProvider from '../../contexts/ClickCanvaCapture/ClickCanvaProvider'
import Board from './components/Board'
import { DroppableType } from './configs/constants'
import { onDragEndConfig } from './configs/drag-handlers'
import { getInitialBoardData } from './configs/helpers'

export default function BoardPage() {
  const flowInstance = useReactFlow()
  const { nodes: initialnodes, edges: initialEdges } = getInitialBoardData()
  const nodeState = useNodesState(initialnodes)
  const edgeState = useEdgesState(initialEdges)

  const [nodes] = nodeState

  return (
    <AppShell>
      <DndContext
        onDragEnd={(e: DragEndEvent) => {
          if (!e.over) return

          const type = e.over.data.current?.droppableType as
            | DroppableType
            | undefined
          if (!type) return

          onDragEndConfig[type](e, flowInstance)
        }}
      >
        <AppShell.Main>
          <ClickCanvaProvider>
            <OnboardingContextProvider nodes={nodes}>
              <Board edgeState={edgeState} nodeState={nodeState} />
            </OnboardingContextProvider>
          </ClickCanvaProvider>
        </AppShell.Main>
      </DndContext>
    </AppShell>
  )
}
