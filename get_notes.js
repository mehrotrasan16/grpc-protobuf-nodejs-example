const client = require('./client')
client.list({},(error,notes) =>{
	if(!error){
		console.log('successfully fetched list of Notes')
		console.log(notes)
	}
	else{
		console.error(error)
	}	
})
