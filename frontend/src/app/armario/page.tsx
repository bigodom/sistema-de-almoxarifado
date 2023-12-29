'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
//import Navbar from '@/components/navbar';

const apiURL = process.env.NEXT_PUBLIC_API_URL;

interface Armario {
	number: number;
	name: string;
	situation: string;
	date: string;
}

export default function Armario() {
	const [armarios, setArmarios] = useState<Armario[]>([]);
	const [modalOpen, setModalOpen] = useState(false);
	const [nomeOcupante, setNomeOcupante] = useState('');
	const [number, setNumber] = useState(0);
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
	const [filtro, setFiltro] = useState('');
	const [armariosDisponiveis, setArmariosDisponiveis] = useState(0);
	const [armariosOcupados, setArmariosOcupados] = useState(0);

	useEffect(() => {
		fetchArmarios();
	}, []);

	const fetchArmarios = async () => {
		try {
			const res = await axios.get(`${apiURL}/api/wardrobes`);
			setArmarios(res.data);

			const armariosDisponiveis = res.data.filter((armario: Armario) => armario.situation === 'Disponível').length;
			const armariosOcupados = res.data.filter((armario: Armario) => armario.situation === 'Ocupado').length;
			setArmariosDisponiveis(armariosDisponiveis);
			setArmariosOcupados(armariosOcupados);
		} catch (error) {
			console.log(error);
		}
	};

	const getRowColorClass = (situation: string) => {
		return situation === 'Ocupado' ? 'text-danger fw-bold' : 'text-success fw-bold';
	};

	const handleUpdateWardrobe = async () => {
		try {
			await axios.put(`${apiURL}/api/wardrobe/${number}`, { name: nomeOcupante, situation: 'Ocupado', date: new Date().toLocaleDateString() });
			fetchArmarios();
			handleModalClose();
		} catch (error) {
			console.log(error);
		}
	}

	const handleClearWardrobe = async () => {
		try {
			await axios.put(`${apiURL}/api/wardrobe/${number}`, { name: '', situation: 'Disponível', date: '' });
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

	const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setFiltro(event.target.value)
	}

	const sortedArmarios = [...armarios].sort((a: Armario, b: Armario) => {
		const situationA = a.situation.toLowerCase();
		const situationB = b.situation.toLowerCase();

		if (sortOrder === 'asc') {
			return situationA.localeCompare(situationB);
		} else {
			return situationB.localeCompare(situationA);
		}
	});

	const handleExportCSV = () => {
		// Extract only the needed columns
		const csvData = armarios.map(({ number, situation, name, date }) => ({
			NUMERO: number,
			SITUACAO: situation,
			NOME: name,
			DATA: date,
		}));

		// Create CSV string manually
		const csv = Papa.unparse(csvData, {
			columns: ['NUMERO', 'SITUACAO', 'NOME', 'DATA'],
			delimiter: ';',
		});

		const csvBlob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });

		// Create a link and trigger a click to download the file
		const csvURL = window.URL.createObjectURL(csvBlob);
		const tempLink = document.createElement('a');
		tempLink.href = csvURL;
		tempLink.setAttribute('download', 'armarios.csv');
		document.body.appendChild(tempLink);
		tempLink.click();
		document.body.removeChild(tempLink);
	};

	return (
		<div>
			<div style={{ width: '80vw', margin: 'auto' }}>
				<h1 className='text-center my-5' >Lista de Armários</h1>
				<input type="text" className='form-control' placeholder='Digite o número do armário ou o nome da pessoa' value={filtro} onChange={handleFilterChange} />
			</div>
			<div style={{ width: '80vw', height: '600px', margin: 'auto' }}>
				<div className="h-100 overflow-y-auto ">

					<table className='table table-striped table-bordered table-hover' style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
						<thead>
							<tr>
								<th style={{ width: '5%' }}>Número</th>
								<th style={{ width: '15%' }}>Situação</th>
								<th style={{ width: '62%' }}>Nome</th>
								<th style={{ width: '' }} >Data</th>
								<th>...</th>
							</tr>
						</thead>
						<tbody>
							{Array.isArray(sortedArmarios) && sortedArmarios
								.filter(armario => armario.name.toLocaleLowerCase().includes(filtro.toLowerCase()))
								.map((armario: Armario) => (
									<tr key={armario.number} >
										<td className='text-center'>{armario.number}</td>
										<td className={getRowColorClass(armario.situation)}>{armario.situation}</td>
										<td>{armario.name}</td>
										<td>{armario.date}</td>
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


			<div className='text-center fw-bold'>
				<div className='text-success'>Armarios Disponíveis: {armariosDisponiveis}</div>
				<div className='text-danger'>Armarios Ocupados: {armariosOcupados}</div>
				<div className='mb-8 mb-4'>
					<h4 className="text-lg mb-2"> Exportar Armários para CSV</h4>
					<button type='button' className='btn btn-primary' onClick={handleExportCSV}>BAIXAR</button>
				</div>
			</div>

		</div>


	);
}

