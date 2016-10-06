( function ( scope, factory ) {
	if( typeof exports === 'object' && typeof module === 'object' ) {
		module.exports = factory( scope );
	} else if( typeof define === 'function' && define.amd ) {
		define( [], function () { return factory( scope ); } );
	} else {
		( typeof exports === 'object' ? exports : window ).VendorPrefixes = factory( scope );
	}
} ) ( this, function () {
	function ShiftObject( target ) {
		for( var key in target ) 
			return { key: key, value: PopProp( target, key ) };
	};
	function PopProp( target, property ) {
		var value = target[ property ];
		delete target[ property ];
		return value;
	};
	function ObjectValues( target, skip ) {
		var result = []; skip = skip || 0;
		for( var key in target ) 
			if( --skip < 0 ) 
				result.push( target[ key ] );
		return result;
	};
	var HasOwn = ( function () {
		var has_own = {}.hasOwnProperty;
		return function HasOwn( target, name ) {
			return !!name && has_own.call( target, name );
		};
	} ) ();
	var self = {}, 
		main = self, 
		prefix_to_index = {}, 
		prefixes = [], 
		default_type = 'JS', 
		matched = false;

	( function () {
		var list = [ 'Webkit', 'Moz', 'MS', 'O' ], i = 0;
		for( ; i < list.length; i++ ) {
			var pre = list[i], 
				lower = pre.toLowerCase(), 
				for_css = '-' + lower + '-', 
				upper = pre.toUpperCase() + '_', 
				for_event = pre == 'MS' ? pre : lower;

			prefixes.push( { JS: lower, JSClass: pre, CSS: for_css, const:  upper, event: for_event } );
			prefix_to_index[ lower ] = i;
		}
	} ) ();

	function Match( index ) {
		var info = prefixes[ index ];
		matched = true;
		prefixes = [ info ];
		main.current = info[ 'JS' ];
	};
	function FirstToUpper( value ) { return value[0].toUpperCase() + value.slice(1); };
	function PrefixToJS( value ) { return value.toLowerCase().replace( /^\-|\-$/g, '' ); };
	function CheckMatched() {
		if( !matched )
			throw new Error( 'Vendor prefix of this browser is not found yet.' );	
		return matched;
	};
	function GetVersions( value, type ) {
		if( !main.checkType( type ) )
			type = default_type;

		var is_event = type == 'event', 
			result = {}, 
			i = 0;

		if( is_event || type == 'JS' || type == 'JSClass' ) 
			value = FirstToUpper( value );

		for( ; i < prefixes.length; i++ ) {
			var info = prefixes[i];
			result[ info[ 'JS' ] ] = info[ type ] + value;
		}
		return result;
	};

	/**
	 * Currently fixed prefix.
	 * @type {String}
	 */
	main.current = null;

	/**
	 * Checks if given type is valid.
	 * @param  {String}		type
	 * @return {Boolean}
	 */
	main.checkType = function ( type ) { return HasOwn( prefixes[0], type ); };

	/**
	 * Get all possible verions for a string.
	 * If vendor already choosen, 
	 * it will not return only not prefixed and that vendor prefixed versions.
	 * @param  {String}		value		String to prefix.
	 * @param  {UINT}		type		Prefix type to use.
	 * @param  {Boolean}	as_array	Return results as array, or as object which keys are prefixes and values are prefixed versions.
	 * @return {Mixed}		
	 */
	main.versions = function ( value, type, as_array ) {
		var result = GetVersions( value, type );
		return as_array ? ObjectValues( result ) : result;
	};

	/**
	 * Try all versions for specified item.
	 * This loops over all verions and executes given checker function on all of the versions.
	 * Checker must return true on success.
	 * @param	{String}		value	
	 * @param	{UINT}		type	
	 * @param	{Function}	checker	
	 * @return	{Object}				null if nothing worked, working prefix version information otherwise.
	 */
	main.try = function ( value, type, checker ) {
		var versions = GetVersions( value, type ), 
			i = 0;
		for( var prefix in versions ) {
			var current = versions[ prefix ];

			//	If this version is supported.
			//	Save this as the main version, and return it.
			if( checker( current ) ) {
				if( !matched )
					Match( i );

				//	Filling prefix to value map in result.
				return {
					prefix: prefix, 
					version: current
				};
			}
			i++;
		}
		return null;
	};

	/**
	 * Make a vendor prefix version for given value.
	 * @param	{String}	value	Value that needs to be prefixed.
	 * @param	{UINT}		type 	Prefix type.
	 * @return	{String} 		
	 */
	main.make = function ( value, type ) {
		return CheckMatched() && ShiftObject( GetVersions( value, type ) ).value;
	};

	/**
	 * Implicitly set a vendor.
	 * @param	{String}	prefix	Prefix string.
	 */
	main.matched = function ( prefix ) {
		if( matched ) 
			return false;
		prefix = PrefixToJS( prefix );
		var choosed = HasOwn( prefix_to_index, prefix );
		if( choosed )
			Match( prefix_to_index[ prefix ] );
		return choosed;
	};
	return main;
} );