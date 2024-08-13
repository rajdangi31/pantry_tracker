'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material'
import { firestore } from '@/firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#f7f7f7',
  border: 'none',
  boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.2)',
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
  borderRadius: '10px',
}

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box 
      width="100vw"
      height="100vh"
      display="flex"
      bgcolor="#e0e0e0"
      justifyContent="center"
      flexDirection="column"
      alignItems="center"
      gap={2}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2" color="#00796b" textAlign="center">
            Add Item
          </Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
              sx={{
                bgcolor: '#00796b',
                color: '#fff',
                '&:hover': {
                  bgcolor: '#004d40',
                },
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button 
        variant="contained" 
        onClick={handleOpen}
        sx={{
          bgcolor: '#00796b',
          color: '#fff',
          '&:hover': {
            bgcolor: '#004d40',
          },
        }}
      >
        Add New Item
      </Button>
      <Box border="1px solid #ccc" boxShadow="0px 0px 15px rgba(0, 0, 0, 0.2)" borderRadius="10px">
        <Box
          width="800px"
          height="100px"
          bgcolor="#00796b"
          display="flex"
          justifyContent="center"
          alignItems="center"
          borderRadius="10px 10px 0 0"
        >
          <Typography variant="h4" color="#fff" textAlign="center">
            Inventory Items
          </Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow="auto" bgcolor="#f7f7f7" borderRadius="0 0 10px 10px" p={2}>
          {inventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="50px"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              bgcolor="#e0e0e0"
              paddingX={3}
              borderRadius="10px"
              boxShadow="0px 0px 5px rgba(0, 0, 0, 0.1)"
            >
              <Typography variant="h6" color="#00796b" textAlign="center">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h6" color="#00796b" textAlign="center">
                Quantity: {quantity}
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => addItem(name)}
                sx={{
                  bgcolor: '#00796b',
                  color: '#fff',
                  '&:hover': {
                    bgcolor: '#004d40',
                  },
                }}
              >
                Add
              </Button>
              <Button 
                variant="contained" 
                onClick={() => removeItem(name)}
                sx={{
                  bgcolor: '#c62828',
                  color: '#fff',
                  '&:hover': {
                    bgcolor: '#8e0000',
                  },
                }}
              >
                Remove
              </Button>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}

