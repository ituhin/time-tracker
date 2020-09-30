export function sendError (error: any, res) {
	const response = {
		success: false,
		error: error.message ? error.message : error
	};
	
  console.log(error);
	return res.status(500).json(response);
};

export function sendSuccess (data: any, res) {
	const response = {
		success: true,
		data
	};

  return res.json(response);
};
