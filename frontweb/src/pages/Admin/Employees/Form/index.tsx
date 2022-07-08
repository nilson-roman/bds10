import { useHistory, useParams } from 'react-router-dom';
import { AxiosRequestConfig } from 'axios';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Employee } from 'types/employee';
import { Department } from 'types/department';
import { requestBackend } from 'util/requests';
import Select from 'react-select';


import './styles.css';

type UrlParams = {
  employeeId: string;
};

const Form = () => {
  const { employeeId } = useParams<UrlParams>();

  const isEditing = employeeId !== 'create';

  const history = useHistory();

  const [selectDepartment, setSelectDepartment] = useState<Department[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm<Employee>();

  useEffect(() => {
    requestBackend({ url: `/departments/`, withCredentials: true }).then((response) => {
      setSelectDepartment(response.data);
    });
  }, []);

  useEffect(() => {
    if (isEditing) {
      requestBackend({ url: `/employees/${employeeId}` }).then((response) => {
        const employee = response.data as Employee;

        setValue('name', employee.name);
        setValue('email', employee.email);
        setValue('department', employee.department);
      });
    }
  }, [isEditing, employeeId, setValue]);

  const onSubmit = (formData: Employee) => {
    const data = {
      ...formData,
    };

    const config: AxiosRequestConfig = {
      method: isEditing ? 'PUT' : 'POST',
      url: isEditing ? `/employees/${employeeId}` : '/employees',
      data,
      withCredentials: true,
    };

    requestBackend(config)
    .then(() => {
      toast.info('Funcionário cadastrado com sucesso');
      history.push('/admin/employees');
    })
    .catch(() => {
      toast.error('Erro ao cadastrar funcionário');
    });
  };

  const handleCancel = () => {
    history.push('/admin/employees');
  };

  return (
    <div className="employee-crud-container">
      <div className="base-card employee-crud-form-card">
        <h1 className="employee-crud-form-title">INFORME OS DADOS</h1>

        <form onSubmit={handleSubmit(onSubmit)} data-testid="form">
          <div className="row employee-crud-inputs-container">
            <div className="col employee-crud-inputs-left-container">

              <div className="margin-bottom-30">
              <input
                  {...register('name', {
                    required: 'Campo obrigatório',
                  })}
                  type="text"
                  className={`form-control base-input ${
                    errors.name ? 'is-invalid' : ''
                  }`}
                  placeholder="Nome do funcionário"
                  name="name"
                  data-testid="name"
                />
                <div className="invalid-feedback d-block">
                  {errors.name?.message}
                </div>
              </div>

              <div className="margin-bottom-30">
              <input
                  {...register('email', {
                    required: 'Campo obrigatório',
                  })}
                  type="text"
                  className={`form-control base-input ${
                    errors.name ? 'is-invalid' : ''
                  }`}
                  placeholder="Email do funcionário"
                  name="email"
                  data-testid="email"
                />
                <div className="invalid-feedback d-block">
                  {errors.name?.message}
                </div>
              </div>

              <div className="margin-bottom-30 ">
                <label htmlFor="department" className="d-none">Departamento</label>
                <Controller
                  name="department"
                  rules={{ required: true }}
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={selectDepartment}
                      classNamePrefix="employee-crud-select"
                      getOptionLabel={(department: Department) => department.name}
                      getOptionValue={(department: Department) =>
                        String(department.id)
                      }
                      inputId="department"
                    />
                  )}
                />
                {errors.department && (
                  <div className="invalid-feedback d-block">
                    Campo obrigatório
                  </div>
                )}
              </div>

            </div>
          </div>
          <div className="employee-crud-buttons-container">
            <button
              className="btn btn-outline-danger employee-crud-button"
              onClick={handleCancel}
            >
              CANCELAR
            </button>
            <button className="btn btn-primary employee-crud-button text-white">
              SALVAR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
