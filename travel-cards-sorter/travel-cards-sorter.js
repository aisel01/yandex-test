'use strict';

function TravelCardsSorter(cards) {
	this.validateData(cards);

	this.cards = cards;

	this._from = {};
	this._to = {};

	this.cards.forEach(function(card) {
		this._from[card.originPoint] = card;
		this._to[card.targetPoint] = card;
	},this);
}

TravelCardsSorter.prototype.validateData = function(data) {
	if(!(data instanceof Array)) {
		throw new Error('Incorrect input format');
	}

	data.forEach(function(card) {
		if(!card.originPoint) {
			throw new Error('Missing originPoint');
		}

		if(!card.targetPoint) {
			throw new Error('Missing targetPoint');
		}
	});
};

TravelCardsSorter.prototype.getStartCard = function() {
	var startCard = false;

	this.cards.forEach(function(card) {
		if(this._to[card.originPoint] === undefined) {
			startCard = card;
		}
	},this);

	return startCard;
};

TravelCardsSorter.prototype.sort = function() {
	var startCard = this.getStartCard();

	if(!startCard) {
		throw new Error('Cannot identify the route');
	}

	this.cards[0] = startCard;
	for (var i = 1; i < this.cards.length; i++) {
		this.cards[i] = this._from[this.cards[i-1].targetPoint];
	}
};

TravelCardsSorter.prototype.createDescription = function(card) {

	function getBaggadeInfo(card) {
		if(card.transport.baggageDrop) {
			return card.transport.baggageDrop.auto ?
				'Baggage will be automatically transfered from your last leg. ' :
				'Baggage drop at ticket counter ' + card.transport.baggageDrop.value + '. ' ;
		}
	}

	function getSeatInfo(card) {
		return card.transport.seat ?
		'Seat ' + card.transport.seat + '. ' :
		'No seat assignment.';
	}

	switch(card.transport.type)	{
		case 'airport bus':
			return 'Take the airport bus from ' + card.originPoint +
				' to ' + card.targetPoint + '. ' + getSeatInfo(card);
		case 'train':
			return 'Take train ' + card.transport.number +
				' from ' + card.originPoint + ' to ' + card.targetPoint + '. '
				+ getSeatInfo(card);
		case 'flight':
			return 'From ' + card.originPoint + ', take flight ' + card.transport.number +
				' to ' + card.targetPoint + '. Gate '+ card.transport.gate + '. ' +
				getSeatInfo(card) + getBaggadeInfo(card);
		case 'walk':
			return 'Take a walk from ' + card.originPoint +
				' to ' + card.targetPoint;
		default:
			return 'Go from ' + card.originPoint +
				' to ' + card.targetPoint;

	}
};

TravelCardsSorter.prototype.getInstructions = function() {
	return this.cards.map(function(card) {
		return this.createDescription(card);
	},this);
};
