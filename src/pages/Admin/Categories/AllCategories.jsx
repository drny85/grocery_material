import { Dialog, DialogActions, DialogContent, Grid, InputAdornment, TextField, Typography } from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Controls from "../../../components/controls/Controls";
import CategoryScrollItem from "../../../components/Items/CategoryScrollItem";
import Loader from "../../../components/Loader";
import { addNewCategory, clearCategoriesError, deleteCategory, getCategories, updateCategory } from '../../../reduxStore/actions/categoriesActions'
import CloseIcon from '@material-ui/icons/Close';
import { Alert } from "@material-ui/lab";
import BackArrow from '../../../components/BackArrow'

const AllCategories = () => {
  const { categories, loading, error } = useSelector(
    (state) => state.categoriesData
  );
  const { user } = useSelector(state => state.userData)
  const textRef = useRef()
  const dispatch = useDispatch()
  const [category, setCategory] = useState("");
  const [fieldError, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [mode, setMode] = useState('add')
  const [selected, setSelected] = useState('')
  const [current, setCurrent] = useState(null)
  const [show, setShow] = useState(false)

  const addCategory = async () => {
    if (category === "") {
      setError(true);
      setErrorMessage("category is required");
      return
    }

    if (mode === 'add') {
      const added = await dispatch(addNewCategory(category))
      if (added) {
        clearAll()
      } else {
        return
      }
    }

    if (mode === 'update') {
      const updated = await dispatch(updateCategory({ ...current, name: category }))
      if (updated) {
        clearAll()
      } else {
        return;
      }
    }


  };

  const onChangetext = text => {
    setCategory(text.target.value)
    if (text.target.value !== '') {
      setError(false)
      setErrorMessage('')
    }
  }

  const handleUpdateSteps = (cat) => {
    setMode('update')
    setCategory(cat.name)
    setSelected(cat.name)
    setCurrent(cat)

  }

  const clearAll = () => {
    setShow(false)
    setMode('add');
    setCategory('');
    setSelected('')
    setErrorMessage('')
    setError(false)
    setCurrent(null)

  }

  const handleDelete = async () => {
    const deleted = await dispatch(deleteCategory(current))
    if (deleted) {
      clearAll()
    }
  }

  useEffect(() => {

    dispatch(getCategories(user?.userId))
    return () => {

    }
  }, [dispatch, user]);

  if (loading) return <Loader />;
  return (
    <div
      style={{
        display: "flex",
        margin: "1rem auto",
        justifyContent: "center",
        alignItems: "center",
        maxWidth: "1080px",
        height: "100%",
      }}
    >

      <Grid container alignContent="center">

        <Grid item xs={12}>
          <BackArrow />
          <Typography align="center" variant="h5">
            All Categories
          </Typography>

        </Grid>
        <Dialog open={show}>
          <DialogContent>
            <Typography>Are you sure you want to delete {current?.name} ?</Typography>
          </DialogContent>
          <DialogActions>
            <Controls.Button text="Cancel" style={{ backgroundColor: 'orange' }} onClick={clearAll} />
            <Controls.Button color='primary' text="Delete" onClick={handleDelete} />
          </DialogActions>
        </Dialog>


        {user && user.isAdmin && (
          <>
            <Grid item container style={{ width: "80vw", margin: "1rem auto" }}>
              {error && (<Grid item style={{ margin: '1rem 0', width: '100%' }}>
                <Alert variant='outlined' severity='error' onClose={() => { dispatch(clearCategoriesError()) }}>{error}</Alert>
              </Grid>)}




              <TextField
                ref={textRef}
                label="Category Name"
                value={category}
                variant="outlined"
                fullWidth
                error={fieldError}
                helperText={errorMessage}
                onChange={onChangetext}
                InputProps={{
                  endAdornment: mode === 'update' && (<InputAdornment>

                    <CloseIcon onClick={clearAll} />
                  </InputAdornment>)
                }}
              />

              <Grid>
                <Controls.Button
                  style={{ margin: "1rem 0" }}
                  color={mode === 'add' ? 'primary' : 'secondary'}
                  text={mode === 'add' ? 'Add Category' : 'Update Category'}
                  onClick={addCategory}
                />
                {mode === 'update' && (<Controls.Button text='Delete Category' onClick={() => setShow(true)} style={{ backgroundColor: 'orange' }} />)}
              </Grid>
            </Grid>

          </>
        )}

        <Grid item container alignItems="center">
          {categories.length > 0 ? (
            categories
              .sort((a, b) => (a.name < b.name ? -1 : 1))
              .map((cat) => <CategoryScrollItem key={cat.id} name={cat.name} selected={selected} onClick={() => handleUpdateSteps(cat)} />)
          ) : (
              <Grid item>
                <Typography variant="h6">No Categories</Typography>
              </Grid>
            )}
        </Grid>
      </Grid>
    </div>
  );
};

export default AllCategories;
