import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiPower, FiTrash2 } from 'react-icons/fi';
import logoImg from '../../assets/logo.svg';

import api from '../../services/api';
import './styles.css';

export default function Profile() {

    const [incidesnts, setIncidents] = useState([]);

    const history = useHistory();

    const ongId = localStorage.getItem('ongId');
    const ongName = localStorage.getItem('ongName');

    useEffect(() => {
        api.get('profile', {
            headers: {
                Authorization: ongId
            }
        })
            .then(response => {
                setIncidents(response.data);
            });
    }, [ongId]);


    async function handleDeleteIncident(id) {
        try {
            await api.delete(`incidents/${id}`, {
                headers: {
                    Authorization: ongId
                }
            });

            setIncidents(incidesnts.filter(incidesnt => incidesnt.id !== id));

        } catch (error) {
            alert("Erro ao deletar o caso, tente novamente.");
        }
    }

    function handleLogout() {
        localStorage.clear();
        history.push('/');
    }

    return (
        <div className="profile-container">
            <header>
                <img src={logoImg} alt="Be The Hero"></img>
                <span>Bem vinda, {ongName}</span>

                <Link className="button" to="/incidents/new">Cadastrar novo caso</Link>

                <button type="button" onClick={handleLogout}>
                    <FiPower size={18} color="#E02041" />
                </button>
            </header>

            <h1>Casos cadastrados</h1>

            <ul>

                {incidesnts.map(incidesnt => (
                    <li key={incidesnt.id}>
                        <strong>CASO:</strong>
                        <p>{incidesnt.title}</p>

                        <strong>DESCRÇÃO:</strong>
                        <p>{incidesnt.description}</p>

                        <strong>VALOR:</strong>
                        <p>
                            {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                                .format(incidesnt.value)}
                        </p>

                        <button onClick={() => handleDeleteIncident(incidesnt.id)} type="button">
                            <FiTrash2 size="20" color="#a8a8b3" />
                        </button>
                    </li>
                ))}
            </ul>

        </div>
    )
}