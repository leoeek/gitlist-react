import React, { useState, useEffect, FormEvent } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../services/api';

import logoImg  from '../../asssets/logo.svg';

import { Title, Form, Repositories, Error } from './styles';

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState('');
  const [inputError, setInputErro] = useState('');
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storagedRespositories = localStorage.getItem('@Gitlist:repositories');
    if (storagedRespositories) {
      return JSON.parse(storagedRespositories);
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('@Gitlist:repositories', JSON.stringify(repositories));
  }, [repositories])

  async function handleAddRepository(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (!newRepo) {
      setInputErro('Digite o autor/nome do repositório');
      return;
    }

    try {
      const response = await api.get<Repository>(`repos/${newRepo}`);
      const repository = response.data;
      setRepositories([...repositories, repository]);
      setNewRepo('');
      setInputErro('');
    }
    catch (err) {
      setInputErro('Erro na busca por esse repositório');
    }
  }

  return (
    <>
      <img src={logoImg} alt="Logo Github" />
      <Title>Explore repositórios no Github</Title>

      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input
          placeholder="Informe o nome do repositório"
          value={newRepo}
          onChange={(e) => setNewRepo(e.target.value)}
        />
        <button type="submit">Pesquisar</button>
      </Form>

      {inputError && <Error>{inputError}</Error>}

      <Repositories>
        {repositories.map(repository => (
          <Link key={repository.full_name} to={`/repositories/${repository.full_name}`}>
           <img
             src={repository.owner.avatar_url}
             alt={repository.owner.login}
           />
           <div>
             <strong>{repository.full_name}</strong>
             <p>{repository.description}</p>
           </div>

           <FiChevronRight size={20} />
          </Link>
        ))}
      </Repositories>
    </>
  );
}

export default Dashboard;
