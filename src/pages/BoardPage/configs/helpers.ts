import { ReactFlowInstance, XYPosition } from 'reactflow'
import { v4 as uuidv4 } from 'uuid'

import { cloneDeep } from 'lodash'
import { IConnexion } from '../components/Board/components/connexionContants'
import {
  ILocalStorage,
  IService,
  STORAGE_DATA_INDEX_KEY,
  ServiceIdType,
  SubService,
  TCustomNode,
  serviceConfig,
} from './constants'

export const getNewNode = ({
  serviceIdType,
  position,
  ...initialService
}: {
  serviceIdType: ServiceIdType
  position: XYPosition
} & Partial<IService>): TCustomNode => {
  const nodeID = initialService.id || uuidv4()
  return {
    id: nodeID,
    type: 'service',
    position,
    data: {
      id: nodeID,
      serviceIdType,
      title: serviceConfig[serviceIdType].defaultLabel,
      subServices: [],
      note: '',
      ...initialService,
    },
  }
}

export const handleAddNode = (
  newNode: TCustomNode,
  flowInstance: ReactFlowInstance,
) => {
  flowInstance.setNodes((oldNodes: TCustomNode[]) => [...oldNodes, newNode])
}

export const getInitialBoardData = (): ILocalStorage => {
  const storageReference: ILocalStorage | undefined =
    STORAGE_DATA_INDEX_KEY &&
    !!localStorage.getItem(STORAGE_DATA_INDEX_KEY) &&
    JSON.parse(localStorage.getItem(STORAGE_DATA_INDEX_KEY) as string)

  if (!storageReference) return { timestamp: new Date(), nodes: [], edges: [] }

  return {
    timestamp: new Date(storageReference.timestamp),
    nodes: storageReference.nodes,
    edges: storageReference.edges,
  }
}

export const storeInLocal = (boardId: string, data: ILocalStorage) => {
  localStorage.setItem(boardId as string, JSON.stringify(data))
}

export const handleDeleteNode = (
  nodeId: string,
  flowInstance: ReactFlowInstance,
) => {
  flowInstance.setNodes((oldNodes) =>
    oldNodes.filter((compNode) => compNode.id != nodeId),
  )
  flowInstance.setEdges((oldEdges) =>
    oldEdges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
  )
}

export const handleDeleteSubservice = (
  deleteId: SubService['id'],
  flowInstance: ReactFlowInstance,
) => {
  flowInstance.setNodes((oldNodes) =>
    oldNodes.map((compNode: TCustomNode) => {
      const filteredSubServices = compNode.data.subServices.filter(
        (compSubService) => compSubService.id != deleteId,
      )

      const newCompNode = cloneDeep(compNode)
      newCompNode.data.subServices = filteredSubServices

      return newCompNode
    }),
  )
}

export const handleUpdateNode = (
  serviceId: string,
  newNode: TCustomNode,
  flowInstance: ReactFlowInstance,
): void => {
  flowInstance.setNodes((oldNodes) =>
    oldNodes.map((compNode) => {
      return compNode.id === serviceId ? cloneDeep(newNode) : compNode
    }),
  )
}

export const handleUpdateEdge = (
  connexionId: IConnexion['id'],
  partialEdge: Partial<IConnexion>,
  flowInstance: ReactFlowInstance,
) => {
  flowInstance.setEdges((edges) =>
    edges.map((compEdge) => {
      if (compEdge.id !== connexionId) return compEdge

      const edgeCopy = cloneDeep(compEdge)
      edgeCopy.data = { ...edgeCopy.data, ...partialEdge }
      return edgeCopy
    }),
  )
}

export const getNodeOverlapped = (
  draggedNode: TCustomNode,
  nodes: TCustomNode[],
) => {
  const centerX = draggedNode.position.x + Number(draggedNode.width) * 0.5
  const centerY = draggedNode.position.y + Number(draggedNode.height) * 0.5

  const targetNode = nodes
    .filter((compNode) => compNode.id !== draggedNode.id)
    .find(
      (n) =>
        centerX > n.position.x &&
        centerX < n.position.x + Number(n.width) &&
        centerY > n.position.y &&
        centerY < n.position.y + Number(n.height),
    )

  return targetNode
}
