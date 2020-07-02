const grpc = require('grpc')
const { v1: uuidv1 } = require('uuid');
console.log('uuidv1()', uuidv1());
const notesProto = grpc.load('notes.proto')

const notes = [
{id:'1', title: 'Note 1', content: 'Content 1'},
{id:'2', title: 'Note 2', content: 'Content 2'}
]

const server = new grpc.Server()

server.addService(notesProto.NoteService.service,{
	list: (_,callback) => {
		callback(null,notes)
	},
	insert: (call, callback) => {
        let note = call.request
        note.id = uuidv1();
        notes.push(note)
        callback(null, note)
    },
    delete:(call,callback) =>{
	    let existingNoteID = notes.findIndex((n) => n.id == call.request.id)
        if(existingNoteID != -1) {
            notes.splice(existingNoteID, 1)
            callback(null, {})
        }
        else{
            callback({
                code: grpc.status.NOT_FOUND,
                details: "NoteID not found"
            })
        }
    }
})	
server.bind(
	'127.0.0.1:50051',
	grpc.ServerCredentials.createInsecure()
)

console.log('Server running at http://127.0.0.1:50051')
server.start()
