import { useEffect, useState } from 'react';
import { useListProducts, useListModels, ProductConfig, ModelConfig } from '@prequel/react';
import fetchToken from '../fetchToken';
import { PREQUEL_HOST, REACT_ORIGIN } from '../host';

const ProductsExample = () => {
  const [products, setProducts] = useState<ProductConfig[]>();
  const [models, setModels] = useState<ModelConfig[]>();

  const listProducts = useListProducts(fetchToken, REACT_ORIGIN, PREQUEL_HOST);
  const listModels = useListModels(fetchToken, REACT_ORIGIN, PREQUEL_HOST);

  useEffect(() => {
    if (!products && !models) {
      const fetchData = async () => {
        const { results: productResults } = await listProducts({ pageSize: 100 });
        setProducts(productResults);

        const { results: modelResults } = await listModels({ pageSize: 100 });
        setModels(modelResults);
      };

      fetchData();
    }
  }, [products, models, listProducts, listModels]);

  return (
    <div className="mb-5">
      <div className="mb-5">
        <h3>Products</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Models</th>
            </tr>
          </thead>
          <tbody>
            {products?.length ? (
              products.map((product) => (
                <tr>
                  <td>{product.product_name}</td>
                  <td>{product.models.join(', ')}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3}>No products available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mb-5">
        <h3>Models</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Columns</th>
            </tr>
          </thead>
          <tbody>
            {models?.length ? (
              models.map((model) => (
                <tr>
                  <td>{model.model_name}</td>
                  <td>{model.description}</td>
                  <td>{model.columns.join(', ')}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4}>No models available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsExample;
