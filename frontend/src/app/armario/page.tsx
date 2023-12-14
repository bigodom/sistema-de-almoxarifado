'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';

const apiURL = process.env.NEXT_PUBLIC_API_URL;

interface Armario {
    number: number;
    name: string;
    situation: string;
}

export default function armario() {
    const [armarios, setArmarios] = useState<Armario[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [nomeOcupante, setNomeOcupante] = useState('');
    const [number, setNumber] = useState(0);

    useEffect(() => {
        fetchArmarios();
    }, []);

    const fetchArmarios = async () => {
        try {
            const res = await axios.get(`${apiURL}/api/wardrobes`);
            setArmarios(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const getRowColorClass = (situation: string) => {
        return situation === 'Ocupado' ? 'text-danger fw-bold' : 'text-success fw-bold';
    };

    const handleUpdateWardrobe = async () => {
        try {
            await axios.put(`${apiURL}/api/wardrobe/${number}`, { name: nomeOcupante, situation: 'Ocupado' });
            fetchArmarios();
            handleModalClose();
        } catch (error) {
            console.log(error);
        }
    }

    const handleClearWardrobe = async () => {
        try {
            await axios.put(`${apiURL}/api/wardrobe/${number}`, { name: '', situation: 'Disponível'});
            fetchArmarios();
            handleModalClose();
        } catch (error) {
            console.log(error);
        }
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNomeOcupante(e.target.value);
    }

    const handleModalOpen = (number: number) => {
        setNumber(number);
        setModalOpen(true);
    }

    const handleModalClose = () => {
        setModalOpen(false);
    }

    return (
        <div>
        <div style={{ width: '80vw', height: '600px', margin: 'auto' }}>
            <h1>Lista de Armários</h1>
            <div className = "h-100 overflow-y-auto">
                <table className='table table-striped' style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <thead>
                        <tr>
                            <th style={{ padding: '10px' }}>Número</th>
                            <th style={{ padding: '10px' }}>Situação</th>
                            <th style={{ padding: '10px' }}>Nome</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {armarios.map((armario) => (
                            <tr key={armario.number} >
                                <td style={{ padding: '10px' }}>{armario.number}</td>
                                <td className={getRowColorClass(armario.situation)} style={{ padding: '10px' }}>{armario.situation}</td>
                                <td style={{ padding: '10px' }}>{armario.name}</td>
                                <td><button className='btn btn-danger' onClick={() => handleModalOpen(armario.number)}> Atualizar </button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        {modalOpen && (
        <div className="modal" style={{ display: 'block' }}>
          <div className="modal-content">
            <span className="close" onClick={handleModalClose}>
              &times;
            </span>
            <h2>Atualizar Armário</h2>
            <label>
              Nome do Ocupante:
            </label>
              <input type="text" className='form-control mb-3' value={nomeOcupante} onChange={handleNameChange} />
            <div className='d-flex justify-content-around'>
            <button className="btn btn-primary w-30" onClick={() => handleUpdateWardrobe()}>Confirmar</button>
            <button className='btn btn-danger w-30' onClick={() => handleClearWardrobe()}>Desocupar</button>
            </div>
          </div>
        </div>
      )}
        </div>
        

    );
}

