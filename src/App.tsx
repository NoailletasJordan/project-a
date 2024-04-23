import '@mantine/core/styles.css'

import { MantineProvider } from '@mantine/core'
import { StrictMode } from 'react'
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom'
import BoardPage from './pages/BoardPage'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/board/:id" element={<BoardPage />} />
    </Route>,
  ),
)

export default function App() {
  return (
    <StrictMode>
      <MantineProvider>
        <RouterProvider router={router} />
      </MantineProvider>
    </StrictMode>
  )
}
