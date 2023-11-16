'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import Papa from 'papaparse';

const apiURL = 'http://192.168.11.130:3000';

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [itemName, setItemName] = useState('');
  const [quantityIn, setQuantityIn] = useState('');
  const [quantityOut, setQuantityOut] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  interface Item {
    id: number;
    name: string;
    quantityIn: number;
    quantityOut: number;
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleExportCSV = () => {
    // Extract only the needed columns
      const csvData = items.map(({ name, quantityIn, quantityOut }) => ({
        NOME: name,
        ENTRADA: quantityIn,
        SAIDA: quantityOut,
        ESTOQUE: quantityIn - quantityOut,
      }));
  
    // Create CSV string manually
    const csv = Papa.unparse(csvData, {
      columns: ['NOME', 'ENTRADA', 'SAIDA', 'ESTOQUE'],
      delimiter: ';',
    });
  
    const csvBlob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
  
    // Create a link and trigger a click to download the file
    const csvURL = window.URL.createObjectURL(csvBlob);
    const tempLink = document.createElement('a');
    tempLink.href = csvURL;
    tempLink.setAttribute('download', 'items.csv');
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
  };
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }

  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiURL}/api/items`);
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAddItem = async () => {
    try {
      const verifyItem = items.find((item: Item) => item.name === itemName);
      if (verifyItem) {
        window.alert('Item já existe!');
        return;
      }
      await axios.post(`${apiURL}/api/items`, { name: itemName, quantityIn: Number(quantityIn) });
      fetchData();
      setItemName('');
      setQuantityIn('');
    } catch (error) {
      console.error('Error adding new item:', error);
      window.alert('Erro ao adicionar novo item, provavelmente o item já existe!');
    }
  };

  const handleAddQuantityIn = async (itemName: string) => {
    try {
      const selectedItem = items.find((item: Item) => item.name === itemName);
      if (selectedItem) {
        const newQuantity = selectedItem.quantityIn + Number(quantityIn);
        await axios.post(`${apiURL}/api/items/${selectedItem.id}/in`, { quantity: newQuantity });
        fetchData();
        setQuantityIn('');
      }
    } catch (error) {
      console.error('Error adding quantity in:', error);
    }
  };


  const handleAddQuantityOut = async (itemName: string) => {
    try {
      const selectedItem = items.find((item: Item) => item.name === itemName);
      if (selectedItem) {
        const newQuantity = selectedItem.quantityOut + Number(quantityOut);
        console.log(newQuantity);
        await axios.post(`${apiURL}/api/items/${selectedItem.id}/out`, { quantity: newQuantity });
        fetchData();
        setQuantityOut('');
      }
    } catch (error) {
      console.error('Error adding quantity out:', error);
    }
  }

  const handleDeleteItem = async (itemId: number) => {
    const confirm = window.confirm(`Tem certeza que deseja deletar o item ${items.find((item: Item) => item.id === itemId)?.name}?`);

    if (!confirm) {
      return;
    }

    try {
      await axios.delete(`${apiURL}/api/items/${itemId}`);
      console.log('Item deleted');
      fetchData();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  }

  return (
    <div className="container">
      <h2 className="text-3xl mb-4">Controle de Estoque</h2>
      {/* Adicionar Novo Item */}
      <div className="mb-4">
        <h4 className="text-lg mb-2">Adicionar Novo Item</h4>
        <div className="flex">
          <input type="text" className="form-control mb-2" placeholder="Nome do Item" onChange={(e) => setItemName(e.target.value)} />
          <input type="number" className="form-control mb-2" placeholder="Quantidade" onChange={(e) => setQuantityIn(e.target.value)} />
          <button type="button" className="btn btn-primary" onClick={handleAddItem}>
            Adicionar Item
          </button>
        </div>
      </div>

      <div className='d-flex gap-5 mb-4'>
      {/* Adicionar Quantidade de Entrada */}
      <div className="mb-8">
        <h4 className="text-lg mb-2">Adicionar Quantidade de Entrada</h4>
        <div className="">
          <input type="text" className='form-control mb-2' placeholder='Item' onChange={(e) => setItemName(e.target.value)} />
          <input type="number" className="form-control mb-2" placeholder="Quantidade" onChange={(e) => setQuantityIn(e.target.value)} />
          <button type="button" className="btn btn-success" onClick={() => handleAddQuantityIn(itemName)}> Adicionar Quantidade de Entrada </button>
        </div>
      </div>


      {/* Adicionar Quantidade de Saída */}
      <div className="mb-8">
        <h4 className="text-lg mb-2">Adicionar Quantidade de Saída</h4>
        <div className="">
          <input type="text" className='form-control mb-2' placeholder='Item' onChange={(e) => setItemName(e.target.value)} />
          <input type="number" className="form-control mb-2" placeholder="Quantidade" onChange={(e) => setQuantityOut(e.target.value)} />
          <button type="button" className="btn btn-danger" onClick={() => handleAddQuantityOut(itemName)} > Adicionar Quantidade de Saída </button>
        </div>
      </div>
      </div>

      <div className='mb-8 mb-4'>
        <h4 className="text-lg mb-2"> Exportar Itens para CSV</h4>
        <button type='button' className='btn btn-primary' onClick={handleExportCSV}>BAIXAR</button>
      </div>
      {/* Pesquisar Item */}
      <div className="mb-8 mb-4">
        <h4 className="text-lg mb-2">Pesquisar Item</h4>
        <div className="flex">
          <input
            type="text"
            className="form-control flex-grow mr-2"
            placeholder="Nome do Item"
            value={searchTerm}
            onChange={handleInputChange}
          />
        </div>
      </div>
      {/* Tabela de Exibição */}
      <div className="mt-8">
        <h4 className="text-lg mb-2">Itens</h4>
        <table className="table w-full">
          <thead>
            <tr>
              <th scope="col">Nome</th>
              <th scope="col">Quantidade de Entrada</th>
              <th scope="col">Quantidade de Saída</th>
              <th scope='col'>Estoque</th>
              <th scope='col'></th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(items) && items
              .filter((item: Item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((item: Item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.quantityIn}</td>
                  <td>{item.quantityOut}</td>
                  <td>{item.quantityIn - item.quantityOut}</td>
                  <td><button className='btn btn-danger' onClick={() => handleDeleteItem(item.id)}>Deletar</button></td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>

  );
};